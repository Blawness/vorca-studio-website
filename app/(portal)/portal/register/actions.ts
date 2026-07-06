"use server";

import { db } from "@/db";
import { users, clientSignupRequests } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { adminNewRequestEmail } from "@/lib/signup-emails";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const SignupSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        company: z.string().optional(),
        phone: z.string().optional(),
        note: z.string().optional(),
        locale: z.enum(["id", "en"]).default("id"),
    })
    .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"] });

export async function submitSignupRequest(formData: FormData) {
    // Honeypot: bots fill hidden "website" field. Silently succeed.
    if (String(formData.get("website") ?? "").trim() !== "") {
        redirect("/portal/register?success=1");
    }

    const parsed = SignupSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) redirect("/portal/register?error=validation");

    const { name, email, password, company, phone, note, locale } = parsed.data;
    const emailNorm = email.toLowerCase().trim();

    const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, emailNorm))
        .limit(1);
    const [existingReq] = await db
        .select({ id: clientSignupRequests.id, status: clientSignupRequests.status })
        .from(clientSignupRequests)
        .where(eq(clientSignupRequests.email, emailNorm))
        .limit(1);

    // Block if a user already exists, or a non-rejected request is on file.
    if (existingUser || (existingReq && existingReq.status !== "rejected")) {
        redirect("/portal/register?error=exists");
    }

    // A prior rejected request would violate the unique email; remove it.
    if (existingReq?.status === "rejected") {
        await db.delete(clientSignupRequests).where(eq(clientSignupRequests.id, existingReq.id));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let row: { id: number };
    try {
        [row] = await db
            .insert(clientSignupRequests)
            .values({
                name,
                email: emailNorm,
                passwordHash,
                company: company || null,
                phone: phone || null,
                note: note || null,
                locale,
            })
            .returning({ id: clientSignupRequests.id });
    } catch {
        // Unique-email collision from a concurrent submission → same generic result.
        redirect("/portal/register?error=exists");
    }

    try {
        const { subject, html } = adminNewRequestEmail({
            id: row.id,
            name,
            email: emailNorm,
            company,
            phone,
            note,
        });
        await sendEmail({
            to: process.env.ADMIN_NOTIFY_EMAIL ?? "marketing@vorcastudio.com",
            subject,
            html,
        });
    } catch (e) {
        console.error("signup admin email failed", e);
    }

    redirect("/portal/register?success=1");
}
