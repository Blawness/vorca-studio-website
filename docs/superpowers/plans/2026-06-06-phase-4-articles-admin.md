# Phase 4 — Articles Admin Screen (CRUD + Tiptap Editor + R2 Cover Upload) (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full articles CRUD admin area — list, create, edit, delete, publish — using the Tiptap editor and `ImageUpload` from admin-kit, with cover images uploaded to R2. Also update the media screen's reference checker to block deletion of images used as covers.

**Architecture:** App-owned screens under `app/(admin)/admin/articles/`. Server actions in `actions.ts` call Drizzle directly. ISR revalidation (`revalidateTag`) is emitted on publish/update so the public read layer (Phase 5) stays fresh. No public route changes in this phase.

**Tech Stack:** Drizzle (`db`), `articles` table (`db/schema.ts`), `slugify` + `sanitizeHtml` + `Editor` + `ImageUpload` + `ToastOnParam` + `uploadImageAction` + `uploadImage` + `deleteObjectByUrl` from `@blawness/admin-kit`, `zod` for validation, `revalidateTag` from Next.js cache.

**Prerequisites:** Phase 3 complete. Admin shell, auth, and seed admin all working. R2 env vars (`R2_BUCKET`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`) set in `.env.local`.

---

## Migration Roadmap (this plan = Phase 4)

1–3. ✓  4. **Phase 4 — Articles admin screen** ← this document
5. Phase 5 — Public read layer + HTML render + ISR
6. Phase 6 — Data migration Sanity → Postgres
7. Phase 7 — R2 media finalization
8. Phase 8 — Remove Sanity
9. Phase 9 — Update E2E + full verification

---

## Pre-flight

Phase 3 complete. Login works. Admin shell renders. R2 credentials available. Working tree clean.

---

### Task 1: Create working branch

```bash
git switch -c phase-4-articles-admin
```

---

### Task 2: Add R2 environment variables

**Files:** `.env.local`

- [ ] **Step 1: Add R2 vars to `.env.local`**

```
R2_BUCKET=vorca-media
R2_PUBLIC_URL=https://<your-r2-public-url>
R2_ACCESS_KEY_ID=<r2-key-id>
R2_SECRET_ACCESS_KEY=<r2-secret>
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

These are consumed by `@blawness/admin-kit` directly when calling `uploadImage` / `deleteObjectByUrl`.

---

### Task 3: Server actions for articles

**Files:** `app/(admin)/admin/articles/actions.ts` (new)

- [ ] **Step 1: Create `actions.ts`**

```ts
"use server";

import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { slugify, sanitizeHtml } from "@blawness/admin-kit";
import { z } from "zod";

const ArticleSchema = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    content: z.string().min(1),
    coverImageUrl: z.string().optional(),
    category: z.string().min(1),
    author: z.string().min(1),
    readTime: z.coerce.number().int().min(1),
    tags: z.string().optional(), // comma-separated
    status: z.enum(["draft", "published"]),
});

export async function createArticleAction(formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const parsed = ArticleSchema.parse(raw);

    const slug = slugify(parsed.title);
    const content = sanitizeHtml(parsed.content);
    const tags = parsed.tags
        ? parsed.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    await db.insert(articles).values({
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        content,
        coverImageUrl: parsed.coverImageUrl ?? null,
        category: parsed.category,
        author: parsed.author,
        readTime: parsed.readTime,
        tags,
        status: parsed.status,
        publishedAt: parsed.status === "published" ? new Date() : null,
    });

    revalidateTag("articles");
    redirect("/admin/articles?success=created");
}

export async function updateArticleAction(id: number, formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const parsed = ArticleSchema.parse(raw);

    const content = sanitizeHtml(parsed.content);
    const tags = parsed.tags
        ? parsed.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const existing = await db
        .select({ publishedAt: articles.publishedAt, status: articles.status })
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);

    const wasPublished = existing[0]?.status === "published";
    const nowPublished = parsed.status === "published";

    await db
        .update(articles)
        .set({
            title: parsed.title,
            excerpt: parsed.excerpt,
            content,
            coverImageUrl: parsed.coverImageUrl ?? null,
            category: parsed.category,
            author: parsed.author,
            readTime: parsed.readTime,
            tags,
            status: parsed.status,
            publishedAt:
                nowPublished && !wasPublished
                    ? new Date()
                    : existing[0]?.publishedAt ?? null,
            updatedAt: new Date(),
        })
        .where(eq(articles.id, id));

    revalidateTag("articles");
    redirect(`/admin/articles?success=updated`);
}

export async function deleteArticleAction(id: number) {
    await db.delete(articles).where(eq(articles.id, id));
    revalidateTag("articles");
    redirect("/admin/articles?success=deleted");
}

export async function publishArticleAction(id: number) {
    await db
        .update(articles)
        .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
        .where(eq(articles.id, id));
    revalidateTag("articles");
}
```

---

### Task 4: Articles list page

**Files:** `app/(admin)/admin/articles/page.tsx` (new)

- [ ] **Step 1: Create the list page**

```tsx
import Link from "next/link";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ToastOnParam } from "@blawness/admin-kit/components";
import { deleteArticleAction, publishArticleAction } from "./actions";

export default async function AdminArticlesPage() {
    const rows = await db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            status: articles.status,
            category: articles.category,
            publishedAt: articles.publishedAt,
        })
        .from(articles)
        .orderBy(desc(articles.createdAt));

    return (
        <div className="p-8">
            <ToastOnParam
                param="success"
                messages={{
                    created: "Artikel berhasil dibuat.",
                    updated: "Artikel berhasil diperbarui.",
                    deleted: "Artikel berhasil dihapus.",
                }}
            />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Artikel</h1>
                <Link
                    href="/admin/articles/new"
                    className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    + Artikel Baru
                </Link>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="pb-2">Judul</th>
                        <th className="pb-2">Kategori</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Tanggal</th>
                        <th className="pb-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-muted/30">
                            <td className="py-3 font-medium">{row.title}</td>
                            <td className="py-3">{row.category}</td>
                            <td className="py-3">
                                <span
                                    className={
                                        row.status === "published"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }
                                >
                                    {row.status}
                                </span>
                            </td>
                            <td className="py-3">
                                {row.publishedAt
                                    ? row.publishedAt.toLocaleDateString("id-ID")
                                    : "—"}
                            </td>
                            <td className="py-3 flex gap-2">
                                <Link
                                    href={`/admin/articles/${row.id}`}
                                    className="text-brand underline"
                                >
                                    Edit
                                </Link>
                                {row.status === "draft" && (
                                    <form
                                        action={publishArticleAction.bind(null, row.id)}
                                    >
                                        <button
                                            type="submit"
                                            className="text-green-600 underline"
                                        >
                                            Publish
                                        </button>
                                    </form>
                                )}
                                <form
                                    action={deleteArticleAction.bind(null, row.id)}
                                    onSubmit="return confirm('Hapus artikel ini?')"
                                >
                                    <button
                                        type="submit"
                                        className="text-red-500 underline"
                                    >
                                        Hapus
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                Belum ada artikel.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
```

---

### Task 5: Article create page

**Files:** `app/(admin)/admin/articles/new/page.tsx` (new)

- [ ] **Step 1: Create the page**

```tsx
import { ArticleForm } from "../_components/ArticleForm";
import { createArticleAction } from "../actions";
import { uploadImageAction } from "@blawness/admin-kit/screens/media/actions";

export default function NewArticlePage() {
    return (
        <div className="p-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Artikel Baru</h1>
            <ArticleForm
                action={createArticleAction}
                uploadAction={uploadImageAction}
            />
        </div>
    );
}
```

---

### Task 6: Article edit page

**Files:** `app/(admin)/admin/articles/[id]/page.tsx` (new)

- [ ] **Step 1: Create the edit page**

```tsx
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "../_components/ArticleForm";
import { updateArticleAction } from "../actions";
import { uploadImageAction } from "@blawness/admin-kit/screens/media/actions";

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [article] = await db
        .select()
        .from(articles)
        .where(eq(articles.id, Number(id)))
        .limit(1);

    if (!article) notFound();

    return (
        <div className="p-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Edit Artikel</h1>
            <ArticleForm
                article={article}
                action={updateArticleAction.bind(null, article.id)}
                uploadAction={uploadImageAction}
            />
        </div>
    );
}
```

---

### Task 7: Shared ArticleForm component

**Files:** `app/(admin)/admin/articles/_components/ArticleForm.tsx` (new)

This is a client component because it uses the `Editor` (Tiptap) and `ImageUpload` from admin-kit.

- [ ] **Step 1: Create the form component**

```tsx
"use client";

import { useState } from "react";
import { Editor, ImageUpload } from "@blawness/admin-kit/components";
import type { articles } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Article = InferSelectModel<typeof articles>;

const CATEGORIES = [
    "Technology",
    "Design",
    "Business",
    "Development",
    "Marketing",
    "Case Study",
];

export function ArticleForm({
    article,
    action,
    uploadAction,
}: {
    article?: Article;
    action: (formData: FormData) => Promise<void>;
    uploadAction: (formData: FormData) => Promise<{ url: string }>;
}) {
    const [content, setContent] = useState(article?.content ?? "");
    const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="coverImageUrl" value={coverImageUrl} />

            <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input
                    name="title"
                    defaultValue={article?.title}
                    required
                    className="w-full border rounded-md px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                    name="excerpt"
                    defaultValue={article?.excerpt}
                    required
                    rows={3}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Cover Image</label>
                <ImageUpload
                    value={coverImageUrl || undefined}
                    onChange={setCoverImageUrl}
                    label="Upload Cover"
                    uploadAction={uploadAction}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Konten</label>
                <Editor value={content} onChange={setContent} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <select
                        name="category"
                        defaultValue={article?.category ?? ""}
                        required
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="" disabled>Pilih kategori</option>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <input
                        name="author"
                        defaultValue={article?.author ?? "Vorca Studio"}
                        required
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Read Time (menit)
                    </label>
                    <input
                        name="readTime"
                        type="number"
                        min={1}
                        defaultValue={article?.readTime ?? 5}
                        required
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Tags (pisah koma)
                    </label>
                    <input
                        name="tags"
                        defaultValue={article?.tags?.join(", ")}
                        placeholder="nextjs, typescript, web"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                    name="status"
                    defaultValue={article?.status ?? "draft"}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="bg-brand text-white px-6 py-2 rounded-md text-sm font-medium"
                >
                    Simpan
                </button>
                <a
                    href="/admin/articles"
                    className="px-6 py-2 border rounded-md text-sm font-medium"
                >
                    Batal
                </a>
            </div>
        </form>
    );
}
```

---

### Task 8: Update media reference checker

**Files:** `app/(admin)/admin/media/page.tsx`

Now that articles exist, update the `referenceChecker` stub from Phase 3 to actually query the DB.

- [ ] **Step 1: Update the delete action in `media/page.tsx`**

Replace the `deleteAction` function:

```tsx
async function deleteAction(formData: FormData) {
    "use server";
    const { db } = await import("@/db");
    const { articles } = await import("@/db/schema");
    const { sql } = await import("drizzle-orm");
    const url = formData.get("url") as string;
    return handleDeleteMedia(formData, async () => {
        const result = await db
            .select({ id: articles.id })
            .from(articles)
            .where(sql`${articles.coverImageUrl} = ${url}`)
            .limit(1);
        return result.length > 0;
    });
}
```

---

### Task 9: Build and verify

- [ ] **Step 1: Build**

```bash
pnpm build 2>&1 | tee /tmp/phase4-build.log
```

Expected: `✓ Compiled successfully`. All `/admin/articles*` routes in the route table.

- [ ] **Step 2: Dev smoke test**

```bash
pnpm dev > /tmp/dev-phase4.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/articles
kill %1
```

Expected: `307` (redirect to login, proves the route exists and is auth-protected).

- [ ] **Step 3: E2E tests**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed`.

---

### Task 10: Commit

```bash
git add app/(admin)/admin/articles/ app/(admin)/admin/media/page.tsx
git commit -m "feat: articles admin CRUD + Tiptap editor + R2 cover upload (Phase 4)"
```

---

## Self-Review

- **Spec coverage:** §5 articles admin screen (CRUD, Tiptap, R2 upload, server actions, revalidation).
- **`revalidateTag("articles")`:** emitted on every mutation. Phase 5 adds `unstable_cache`/`fetch` tag so the public layer invalidates on publish.
- **`sanitizeHtml` on save:** prevents XSS from Tiptap output before it enters the DB.
- **`onSubmit` confirm on delete:** uses native browser `confirm()` — acceptable for an admin-only tool; no external deps.
- **No public route change:** all new files under `(admin)/`; E2E guest specs unaffected.
