import "server-only";
import { db } from "@/db";
import {
    projects,
    projectUpdates,
    projectTasks,
    deliverables,
    deliverableEvents,
} from "@/db/schema";
import { and, asc, desc, eq, inArray } from "drizzle-orm";

export type ClientProjectSummary = {
    id: number;
    slug: string;
    name: string;
    stage: string;
    progress: number;
    targetDate: string | null;
};

export type ClientDeliverableEvent = {
    id: number;
    action: "approved" | "revision_requested";
    note: string | null;
    createdAt: string;
};

export type ClientDeliverable = {
    id: number;
    title: string;
    fileUrl: string | null;
    previewUrl: string | null;
    approvalStatus: "pending" | "approved" | "revision_requested";
    events: ClientDeliverableEvent[];
};

export type ClientProjectDetail = {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    prd: string | null;
    stage: string;
    progress: number;
    liveUrl: string | null;
    startDate: string | null;
    targetDate: string | null;
    updates: { id: number; title: string; body: string; createdAt: string }[];
    tasks: { id: number; title: string; status: "todo" | "in_progress" | "done"; sortOrder: number }[];
    deliverables: ClientDeliverable[];
};

export async function getClientProjects(userId: number): Promise<ClientProjectSummary[]> {
    const rows = await db
        .select({
            id: projects.id,
            slug: projects.slug,
            name: projects.name,
            stage: projects.stage,
            progress: projects.progress,
            targetDate: projects.targetDate,
        })
        .from(projects)
        .where(eq(projects.clientUserId, userId))
        .orderBy(desc(projects.createdAt));
    return rows.map((r) => ({ ...r, targetDate: r.targetDate ?? null }));
}

export async function getClientProject(
    userId: number,
    slug: string,
): Promise<ClientProjectDetail | null> {
    // Ownership is enforced in the WHERE clause: a client can only ever load a
    // project whose clientUserId matches their own id.
    const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.slug, slug), eq(projects.clientUserId, userId)))
        .limit(1);
    if (!project) return null;

    const [updateRows, taskRows, deliverableRows] = await Promise.all([
        db
            .select()
            .from(projectUpdates)
            .where(eq(projectUpdates.projectId, project.id))
            .orderBy(desc(projectUpdates.createdAt)),
        db
            .select()
            .from(projectTasks)
            .where(eq(projectTasks.projectId, project.id))
            .orderBy(asc(projectTasks.sortOrder), asc(projectTasks.id)),
        db
            .select()
            .from(deliverables)
            .where(eq(deliverables.projectId, project.id))
            .orderBy(desc(deliverables.createdAt)),
    ]);

    const deliverableIds = deliverableRows.map((d) => d.id);
    const eventRows = deliverableIds.length
        ? await db
              .select()
              .from(deliverableEvents)
              .where(inArray(deliverableEvents.deliverableId, deliverableIds))
              .orderBy(desc(deliverableEvents.createdAt))
        : [];

    return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        description: project.description,
        prd: project.prd,
        stage: project.stage,
        progress: project.progress,
        liveUrl: project.liveUrl,
        startDate: project.startDate,
        targetDate: project.targetDate,
        updates: updateRows.map((u) => ({
            id: u.id,
            title: u.title,
            body: u.body,
            createdAt: u.createdAt.toISOString(),
        })),
        tasks: taskRows.map((t) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            sortOrder: t.sortOrder,
        })),
        deliverables: deliverableRows.map((d) => ({
            id: d.id,
            title: d.title,
            fileUrl: d.fileUrl,
            previewUrl: d.previewUrl,
            approvalStatus: d.approvalStatus,
            events: eventRows
                .filter((e) => e.deliverableId === d.id)
                .map((e) => ({
                    id: e.id,
                    action: e.action,
                    note: e.note,
                    createdAt: e.createdAt.toISOString(),
                })),
        })),
    };
}

export async function getDeliverableOwner(deliverableId: number): Promise<number | null> {
    const [row] = await db
        .select({ clientUserId: projects.clientUserId })
        .from(deliverables)
        .innerJoin(projects, eq(deliverables.projectId, projects.id))
        .where(eq(deliverables.id, deliverableId))
        .limit(1);
    return row?.clientUserId ?? null;
}
