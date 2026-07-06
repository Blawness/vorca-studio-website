"use server";

import { db } from "@/db";
import {
    projects,
    projectUpdates,
    projectTasks,
    deliverables,
} from "@/db/schema";
import { generateProjectSlug } from "@/lib/project-slug";
import { requirePermission } from "@blawness/admin-kit/auth-helpers";
import { sanitizeHtml } from "@blawness/admin-kit";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const StageEnum = z.enum(["planning", "design", "development", "review", "completed"]);

const ProjectSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    prd: z.string().optional(),
    clientUserId: z.coerce.number().int().min(1),
    stage: StageEnum,
    progress: z.coerce.number().int().min(0).max(100),
    liveUrl: z.string().url().optional().or(z.literal("")),
    startDate: z.string().optional(),
    targetDate: z.string().optional(),
});

function parseProject(formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const p = ProjectSchema.parse(raw);
    return {
        name: p.name,
        description: p.description || null,
        prd: p.prd ? sanitizeHtml(p.prd) : null,
        clientUserId: p.clientUserId,
        stage: p.stage,
        progress: p.progress,
        liveUrl: p.liveUrl || null,
        startDate: p.startDate || null,
        targetDate: p.targetDate || null,
    };
}

export async function createProjectAction(formData: FormData) {
    await requirePermission("projects.create");
    const values = parseProject(formData);
    const [row] = await db
        .insert(projects)
        .values({ ...values, slug: generateProjectSlug() })
        .returning({ id: projects.id });
    revalidatePath("/admin/projects");
    redirect(`/admin/projects/${row.id}?success=created`);
}

export async function updateProjectAction(id: number, formData: FormData) {
    await requirePermission("projects.update");
    const values = parseProject(formData);
    await db.update(projects).set({ ...values, updatedAt: new Date() }).where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    redirect(`/admin/projects/${id}?success=updated`);
}

export async function deleteProjectFormAction(formData: FormData) {
    await requirePermission("projects.delete");
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=deleted");
}

// --- Updates ---
export async function addUpdateAction(formData: FormData) {
    await requirePermission("projects.update");
    const projectId = Number(formData.get("projectId"));
    const title = String(formData.get("title") ?? "").trim();
    const body = sanitizeHtml(String(formData.get("body") ?? ""));
    if (!Number.isInteger(projectId) || !title || !body) return;
    await db.insert(projectUpdates).values({ projectId, title, body });
    revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteUpdateFormAction(formData: FormData) {
    await requirePermission("projects.update");
    const id = Number(formData.get("id"));
    const projectId = Number(formData.get("projectId"));
    if (!Number.isInteger(id)) return;
    await db.delete(projectUpdates).where(eq(projectUpdates.id, id));
    revalidatePath(`/admin/projects/${projectId}`);
}

// --- Tasks ---
export async function addTaskAction(formData: FormData) {
    await requirePermission("projects.update");
    const projectId = Number(formData.get("projectId"));
    const title = String(formData.get("title") ?? "").trim();
    const sortOrder = Number(formData.get("sortOrder") ?? 0);
    if (!Number.isInteger(projectId) || !title) return;
    await db.insert(projectTasks).values({
        projectId,
        title,
        sortOrder: Number.isInteger(sortOrder) ? sortOrder : 0,
    });
    revalidatePath(`/admin/projects/${projectId}`);
}

export async function updateTaskAction(formData: FormData) {
    await requirePermission("projects.update");
    const id = Number(formData.get("id"));
    const projectId = Number(formData.get("projectId"));
    const status = z.enum(["todo", "in_progress", "done"]).parse(formData.get("status"));
    if (!Number.isInteger(id)) return;
    await db.update(projectTasks).set({ status }).where(eq(projectTasks.id, id));
    revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteTaskFormAction(formData: FormData) {
    await requirePermission("projects.update");
    const id = Number(formData.get("id"));
    const projectId = Number(formData.get("projectId"));
    if (!Number.isInteger(id)) return;
    await db.delete(projectTasks).where(eq(projectTasks.id, id));
    revalidatePath(`/admin/projects/${projectId}`);
}

// --- Deliverables ---
export async function addDeliverableAction(formData: FormData) {
    await requirePermission("projects.update");
    const projectId = Number(formData.get("projectId"));
    const title = String(formData.get("title") ?? "").trim();
    const fileUrl = String(formData.get("fileUrl") ?? "").trim() || null;
    const previewUrl = String(formData.get("previewUrl") ?? "").trim() || null;
    if (!Number.isInteger(projectId) || !title) return;
    await db.insert(deliverables).values({ projectId, title, fileUrl, previewUrl });
    revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteDeliverableFormAction(formData: FormData) {
    await requirePermission("projects.update");
    const id = Number(formData.get("id"));
    const projectId = Number(formData.get("projectId"));
    if (!Number.isInteger(id)) return;
    await db.delete(deliverables).where(eq(deliverables.id, id));
    revalidatePath(`/admin/projects/${projectId}`);
}
