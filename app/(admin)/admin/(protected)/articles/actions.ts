"use server";

import { db } from "@/db";
import { articles } from "@/db/schema";
import { sanitizeHtml, slugify } from "@blawness/admin-kit";
import { requireUser } from "@blawness/admin-kit/auth-helpers";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ArticleSchema = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    content: z.string().min(1),
    // Reject anything that isn't an http(s) URL so a future copy/paste of a
    // `javascript:` or relative path can't end up as an <img src> on the
    // public site. Empty/missing → caller stores NULL.
    coverImageUrl: z
        .string()
        .url()
        .refine((u) => /^https?:\/\//.test(u), "coverImageUrl must be http(s)")
        .optional(),
    categoryId: z.coerce.number().int().min(1),
    authorId: z.coerce.number().int().min(1),
    status: z.enum(["draft", "published"]),
});

function revalidateArticles() {
    revalidateTag("articles", "max");
}

function parseArticleForm(formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const parsed = ArticleSchema.parse(raw);

    return {
        ...parsed,
        content: sanitizeHtml(parsed.content),
        coverImageUrl: parsed.coverImageUrl || null,
    };
}

export async function createArticleAction(formData: FormData) {
    await requireUser();
    const parsed = parseArticleForm(formData);

    try {
        await db.insert(articles).values({
            title: parsed.title,
            slug: slugify(parsed.title),
            excerpt: parsed.excerpt,
            content: parsed.content,
            coverImageUrl: parsed.coverImageUrl,
            categoryId: parsed.categoryId,
            authorId: parsed.authorId,
            status: parsed.status,
            publishedAt: parsed.status === "published" ? new Date() : null,
        });
    } catch (e) {
        // articles.slug is UNIQUE — a duplicate title throws a Postgres
        // unique-constraint violation. Surface it as a friendly error
        // instead of a raw 500.
        console.error("createArticleAction insert failed", e);
        redirect("/admin/articles?error=save-failed");
    }

    revalidateArticles();
    redirect("/admin/articles?success=created");
}

export async function updateArticleAction(id: number, formData: FormData) {
    await requireUser();
    const parsed = parseArticleForm(formData);

    const [existing] = await db
        .select({ publishedAt: articles.publishedAt, status: articles.status })
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);

    const wasPublished = existing?.status === "published";
    const nowPublished = parsed.status === "published";

    try {
        await db
            .update(articles)
            .set({
                title: parsed.title,
                excerpt: parsed.excerpt,
                content: parsed.content,
                coverImageUrl: parsed.coverImageUrl,
                categoryId: parsed.categoryId,
                authorId: parsed.authorId,
                status: parsed.status,
                publishedAt:
                    nowPublished && !wasPublished
                        ? new Date()
                        : existing?.publishedAt ?? null,
                updatedAt: new Date(),
            })
            .where(eq(articles.id, id));
    } catch (e) {
        console.error("updateArticleAction update failed", e);
        redirect(`/admin/articles/${id}?error=save-failed`);
    }

    revalidateArticles();
    redirect("/admin/articles?success=updated");
}

export async function deleteArticleAction(id: number) {
    await requireUser();
    await db.delete(articles).where(eq(articles.id, id));
    revalidateArticles();
    redirect("/admin/articles?success=deleted");
}

export async function deleteArticleFormAction(formData: FormData) {
    await requireUser();
    const id = Number(formData.get("id"));
    if (!Number.isFinite(id)) return;

    await deleteArticleAction(id);
}

export async function publishArticleAction(id: number) {
    await requireUser();
    await db
        .update(articles)
        .set({
            status: "published",
            publishedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(articles.id, id));

    revalidateArticles();
}
