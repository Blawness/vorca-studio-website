"use server";

import { db } from "@/db";
import { users, clientSignupRequests } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { clientApprovedEmail, clientRejectedEmail } from "@/lib/signup-emails";
import { requirePermission, requireUserId } from "@blawness/admin-kit/auth-helpers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function approveRequestFormAction(formData: FormData) {
    await requirePermission("clientRequests.review");
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;
    const reviewer = await requireUserId();

    const notify: { locale: "id" | "en"; name: string; email: string } | null = await db.transaction(async (tx) => {
        const [req] = await tx
            .select()
            .from(clientSignupRequests)
            .where(eq(clientSignupRequests.id, id))
            .limit(1);
        if (!req || req.status !== "pending") return null; // idempotent guard

        const [existingUser] = await tx
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, req.email))
            .limit(1);

        if (!existingUser && req.passwordHash) {
            await tx.insert(users).values({
                email: req.email,
                name: req.name,
                passwordHash: req.passwordHash,
                role: "client",
            });
        }

        await tx
            .update(clientSignupRequests)
            .set({
                status: "approved",
                reviewedByUserId: reviewer,
                reviewedAt: new Date(),
                passwordHash: null, // hash now lives only in users
            })
            .where(eq(clientSignupRequests.id, id));

        return { locale: (req.locale as "id" | "en") ?? "id", name: req.name, email: req.email };
    });

    if (notify) {
        try {
            const { subject, html } = clientApprovedEmail({ locale: notify.locale, name: notify.name });
            await sendEmail({ to: notify.email, subject, html });
        } catch (e) {
            console.error("approve email failed", e);
        }
    }

    revalidatePath("/admin/client-requests");
    redirect("/admin/client-requests?success=approved");
}

export async function rejectRequestFormAction(formData: FormData) {
    await requirePermission("clientRequests.review");
    const id = Number(formData.get("id"));
    const reviewNote = String(formData.get("reviewNote") ?? "").trim() || null;
    if (!Number.isInteger(id)) return;
    const reviewer = await requireUserId();

    const [req] = await db
        .select()
        .from(clientSignupRequests)
        .where(eq(clientSignupRequests.id, id))
        .limit(1);
    if (!req || req.status !== "pending") {
        redirect("/admin/client-requests");
    }

    await db
        .update(clientSignupRequests)
        .set({
            status: "rejected",
            reviewNote,
            reviewedByUserId: reviewer,
            reviewedAt: new Date(),
            passwordHash: null, // no longer needed
        })
        .where(eq(clientSignupRequests.id, id));

    try {
        const { subject, html } = clientRejectedEmail({
            locale: (req.locale as "id" | "en") ?? "id",
            name: req.name,
            reason: reviewNote ?? undefined,
        });
        await sendEmail({ to: req.email, subject, html });
    } catch (e) {
        console.error("reject email failed", e);
    }

    revalidatePath("/admin/client-requests");
    redirect("/admin/client-requests?success=rejected");
}
