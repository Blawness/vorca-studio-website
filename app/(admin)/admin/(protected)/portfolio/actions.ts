"use server";

import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { captureThumbnail } from "@/lib/portfolio-thumbnail";
import { fetchVercelProjects, frameworkLabel, stripWww } from "@/lib/vercel";
import { requirePermission } from "@blawness/admin-kit/auth-helpers";
import { slugify } from "@blawness/admin-kit";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

function refresh(id?: number) {
    revalidateTag("portfolio", "max");
    revalidatePath("/admin/portfolio");
    if (id) revalidatePath(`/admin/portfolio/${id}`);
}

function humanize(name: string): string {
    return name
        .split(/[-_]+/)
        .filter(Boolean)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
}

/** Pulls the Vercel project list; new projects arrive hidden, existing ones keep their edits. */
export async function syncVercelAction() {
    await requirePermission("portfolio.update");

    let projects;
    try {
        projects = await fetchVercelProjects();
    } catch (err) {
        const msg = err instanceof Error ? err.message : "sync failed";
        redirect(`/admin/portfolio?error=${encodeURIComponent(msg)}`);
    }

    const existing = await db.select().from(portfolioItems);
    const byVercelId = new Map(existing.filter((r) => r.vercelProjectId).map((r) => [r.vercelProjectId!, r]));
    const unlinked = existing.filter((r) => !r.vercelProjectId);
    const slugs = new Set(existing.map((r) => r.slug));

    let added = 0;
    let linked = 0;
    let updated = 0;

    for (const p of projects) {
        const known = byVercelId.get(p.id);
        if (known) {
            if (known.url !== p.url || known.vercelProjectName !== p.name) {
                await db
                    .update(portfolioItems)
                    .set({ url: p.url, vercelProjectName: p.name, updatedAt: new Date() })
                    .where(eq(portfolioItems.id, known.id));
                updated++;
            }
            continue;
        }

        // Adopt a hand-added row (e.g. seeded entry) whose host matches this project.
        const hosts = new Set(p.hosts.map(stripWww));
        const match = unlinked.find((r) => {
            try {
                return hosts.has(stripWww(new URL(r.url).hostname));
            } catch {
                return false;
            }
        });
        if (match) {
            await db
                .update(portfolioItems)
                .set({ vercelProjectId: p.id, vercelProjectName: p.name, updatedAt: new Date() })
                .where(eq(portfolioItems.id, match.id));
            unlinked.splice(unlinked.indexOf(match), 1);
            linked++;
            continue;
        }

        const base = slugify(p.name) || p.id;
        let slug = base;
        for (let i = 2; slugs.has(slug); i++) slug = `${base}-${i}`;
        slugs.add(slug);

        const fw = frameworkLabel(p.framework);
        await db.insert(portfolioItems).values({
            slug,
            vercelProjectId: p.id,
            vercelProjectName: p.name,
            title: humanize(p.name),
            url: p.url,
            tags: fw ? [fw] : [],
        });
        added++;
    }

    refresh();
    redirect(`/admin/portfolio?synced=${added}-${linked}-${updated}`);
}

/** Show/hide on the public site. Showing an item without a thumbnail captures one. */
export async function toggleVisibleAction(formData: FormData) {
    await requirePermission("portfolio.update");
    const id = Number(formData.get("id"));
    const visible = formData.get("visible") === "true";
    if (!Number.isInteger(id)) return;

    const [row] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (!row) return;

    let thumbnailUrl = row.thumbnailUrl;
    let thumbError: string | null = null;
    if (visible && !thumbnailUrl) {
        try {
            thumbnailUrl = await captureThumbnail(row.url, row.slug);
        } catch (err) {
            thumbError = err instanceof Error ? err.message : "screenshot failed";
        }
    }

    await db
        .update(portfolioItems)
        .set({ visible, thumbnailUrl, updatedAt: new Date() })
        .where(eq(portfolioItems.id, id));
    refresh(id);
    if (thumbError) {
        redirect(`/admin/portfolio?error=${encodeURIComponent(`Thumbnail gagal: ${thumbError}`)}`);
    }
}

export async function regenerateThumbnailAction(formData: FormData) {
    await requirePermission("portfolio.update");
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    const [row] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (!row) return;

    let thumbnailUrl: string;
    try {
        thumbnailUrl = await captureThumbnail(row.url, row.slug);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "screenshot failed";
        redirect(`/admin/portfolio/${id}?error=${encodeURIComponent(msg)}`);
    }

    await db
        .update(portfolioItems)
        .set({ thumbnailUrl, updatedAt: new Date() })
        .where(eq(portfolioItems.id, id));
    refresh(id);
    redirect(`/admin/portfolio/${id}?success=thumbnail`);
}

const ItemSchema = z.object({
    title: z.string().trim().min(1),
    category: z.string().trim().min(1),
    url: z.string().url(),
    descriptionId: z.string().trim().optional(),
    descriptionEn: z.string().trim().optional(),
    tags: z.string().optional(),
    thumbnailUrl: z.string().trim().optional(),
    sortOrder: z.coerce.number().int(),
});

export async function updatePortfolioItemAction(id: number, formData: FormData) {
    await requirePermission("portfolio.update");
    const p = ItemSchema.parse(Object.fromEntries(formData.entries()));
    await db
        .update(portfolioItems)
        .set({
            title: p.title,
            category: p.category,
            url: p.url,
            descriptionId: p.descriptionId || null,
            descriptionEn: p.descriptionEn || null,
            tags: (p.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
            thumbnailUrl: p.thumbnailUrl || null,
            sortOrder: p.sortOrder,
            updatedAt: new Date(),
        })
        .where(eq(portfolioItems.id, id));
    refresh(id);
    redirect(`/admin/portfolio/${id}?success=updated`);
}

export async function deletePortfolioItemAction(formData: FormData) {
    await requirePermission("portfolio.delete");
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    refresh();
    redirect("/admin/portfolio?success=deleted");
}
