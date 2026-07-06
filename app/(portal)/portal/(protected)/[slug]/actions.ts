"use server";

import { db } from "@/db";
import { deliverables, deliverableEvents } from "@/db/schema";
import { requireClient } from "@/lib/portal-auth";
import { getDeliverableOwner } from "@/lib/projects";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function assertOwnership(deliverableId: number) {
    const { userId } = await requireClient();
    const owner = await getDeliverableOwner(deliverableId);
    if (owner === null || owner !== userId) {
        throw new Error("Forbidden");
    }
    return userId;
}

export async function approveDeliverable(formData: FormData) {
    const deliverableId = Number(formData.get("deliverableId"));
    const slug = String(formData.get("slug") ?? "");
    if (!Number.isInteger(deliverableId)) return;
    const userId = await assertOwnership(deliverableId);

    await db.update(deliverables).set({ approvalStatus: "approved" }).where(eq(deliverables.id, deliverableId));
    await db.insert(deliverableEvents).values({
        deliverableId,
        action: "approved",
        actorUserId: userId,
    });
    revalidatePath(`/portal/${slug}`);
}

export async function requestRevision(formData: FormData) {
    const deliverableId = Number(formData.get("deliverableId"));
    const slug = String(formData.get("slug") ?? "");
    const note = String(formData.get("note") ?? "").trim();
    if (!Number.isInteger(deliverableId) || !note) return;
    const userId = await assertOwnership(deliverableId);

    await db.update(deliverables).set({ approvalStatus: "revision_requested" }).where(eq(deliverables.id, deliverableId));
    await db.insert(deliverableEvents).values({
        deliverableId,
        action: "revision_requested",
        note,
        actorUserId: userId,
    });
    revalidatePath(`/portal/${slug}`);
}
