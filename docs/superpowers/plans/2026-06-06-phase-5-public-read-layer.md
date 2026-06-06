# Phase 5 — Public Read Layer + HTML Render + ISR (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Sanity-backed article fetching (`sanity/lib/fetch.ts`) with a Drizzle-based read layer (`lib/articles.ts`). Update the public article routes to use ISR instead of `force-dynamic`. Update `ArticleBody` to render sanitized HTML instead of Markdown. The public article pages must work end-to-end from the Postgres DB.

**Architecture:**
- `lib/articles.ts` — the only place the app queries `articles` for public reads. Returns an `Article` type that keeps field names compatible with the existing view components (so minimal view refactoring is needed).
- `app/articles/page.tsx` — listing, switches from Sanity fetch to `getAllArticles()` + ISR.
- `app/articles/[slug]/page.tsx` — detail, switches to `getArticleBySlug(slug)` + ISR + `generateStaticParams`.
- `components/blog/ArticleBody.tsx` — Markdown parser replaced by `sanitizeHtml` + `dangerouslySetInnerHTML`. TOC rebuilt by parsing `<h2>`/`<h3>` tags from the HTML string.

**Tech Stack:** `drizzle-orm`, `db/schema.ts:articles`, `sanitizeHtml` from `@blawness/admin-kit`, `revalidateTag` + `unstable_cache`, `next/cache`.

**Prerequisites:** Phase 4 complete. At least one article in the DB (seed manually or wait for Phase 6 data migration). `DATABASE_URL` in env.

---

## Migration Roadmap (this plan = Phase 5)

1–4. ✓  5. **Phase 5 — Public read layer** ← this document
6. Phase 6 — Data migration Sanity → Postgres
7. Phase 7 — R2 media finalization
8. Phase 8 — Remove Sanity
9. Phase 9 — Update E2E + full verification

---

## Pre-flight

Phase 4 complete. Articles CRUD works in admin. Working tree clean.

---

### Task 1: Create working branch

```bash
git switch -c phase-5-public-read-layer
```

---

### Task 2: Create the public read layer

**Files:** `lib/articles.ts` (new)

This file is the **single source of truth** for all public article reads. Keep it thin — no business logic beyond query + mapping.

- [ ] **Step 1: Create `lib/articles.ts`**

```ts
import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export type Article = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string | null;        // mapped from coverImageUrl
    category: string;
    author: string;
    date: string;                // ISO string from publishedAt
    readTime: number;
    tags: string[];
};

function mapRow(row: typeof articles.$inferSelect): Article {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        image: row.coverImageUrl ?? null,
        category: row.category,
        author: row.author,
        date: row.publishedAt?.toISOString() ?? row.createdAt.toISOString(),
        readTime: row.readTime,
        tags: row.tags,
    };
}

export const getAllArticles = unstable_cache(
    async (): Promise<Article[]> => {
        const rows = await db
            .select()
            .from(articles)
            .where(eq(articles.status, "published"))
            .orderBy(desc(articles.publishedAt));
        return rows.map(mapRow);
    },
    ["articles-list"],
    { tags: ["articles"], revalidate: 3600 }
);

export const getArticleBySlug = unstable_cache(
    async (slug: string): Promise<Article | null> => {
        const [row] = await db
            .select()
            .from(articles)
            .where(eq(articles.slug, slug))
            .limit(1);
        if (!row || row.status !== "published") return null;
        return mapRow(row);
    },
    ["article-by-slug"],
    { tags: ["articles"], revalidate: 3600 }
);

export const getAllSlugs = unstable_cache(
    async (): Promise<string[]> => {
        const rows = await db
            .select({ slug: articles.slug })
            .from(articles)
            .where(eq(articles.status, "published"));
        return rows.map((r) => r.slug);
    },
    ["articles-slugs"],
    { tags: ["articles"], revalidate: 3600 }
);
```

**Note on `unstable_cache`:** The `tags: ["articles"]` ties these caches to the `revalidateTag("articles")` call emitted by admin server actions (Phase 4). When an article is published or updated, the cache invalidates immediately regardless of the `revalidate: 3600` fallback TTL.

---

### Task 3: Update the articles listing page

**Files:** `app/articles/page.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat app/articles/page.tsx
```

- [ ] **Step 2: Replace the Sanity fetch with `getAllArticles`**

Find the import like:
```ts
import { getAllArticles } from "@/sanity/lib/fetch";
```
or similar, and replace with:
```ts
import { getAllArticles } from "@/lib/articles";
```

Also remove `export const dynamic = "force-dynamic"` if present, and add:
```ts
export const revalidate = 3600;
```

The `Article` type from `lib/articles.ts` keeps the same field names (`slug`, `title`, `excerpt`, `image`, `category`, `date`, `readTime`, `tags`) as the old Sanity shape, so the JSX template should need zero changes. Verify by doing a find-all for `article.` property accesses and confirming they exist in the `Article` type.

---

### Task 4: Update the article detail page

**Files:** `app/articles/[slug]/page.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat "app/articles/[slug]/page.tsx"
```

- [ ] **Step 2: Replace Sanity imports**

Replace any:
```ts
import { getArticleBySlug, getAllSlugs } from "@/sanity/lib/fetch";
```
with:
```ts
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
```

- [ ] **Step 3: Update `generateStaticParams`**

```ts
export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}
```

- [ ] **Step 4: Remove `force-dynamic`, add ISR**

Remove: `export const dynamic = "force-dynamic";`
Add: `export const revalidate = 3600;`

- [ ] **Step 5: Verify 404 on missing slug**

The `getArticleBySlug` already returns `null` for unpublished/missing articles. Confirm the page already calls `notFound()` when the result is null. If not, add:

```ts
if (!article) notFound();
```

---

### Task 5: Update ArticleBody to render HTML

**Files:** `components/blog/ArticleBody.tsx`

This component currently parses Markdown. Replace it with HTML rendering.

- [ ] **Step 1: Read the current file**

```bash
cat components/blog/ArticleBody.tsx
```

- [ ] **Step 2: Replace Markdown rendering with HTML**

The new implementation:

```tsx
"use client";

import { sanitizeHtml } from "@blawness/admin-kit";
import { useMemo } from "react";

type TOCHeading = { id: string; text: string; level: 2 | 3 };

function extractHeadings(html: string): TOCHeading[] {
    const headings: TOCHeading[] = [];
    const re = /<(h[23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
    let match;
    while ((match = re.exec(html)) !== null) {
        const level = parseInt(match[1].replace("h", ""), 10) as 2 | 3;
        const id = match[2];
        const text = match[3].replace(/<[^>]+>/g, "");
        headings.push({ id, text, level });
    }
    return headings;
}

export function ArticleBody({ content }: { content: string }) {
    const safe = useMemo(() => sanitizeHtml(content), [content]);
    const headings = useMemo(() => extractHeadings(safe), [safe]);

    return (
        <div className="flex gap-8">
            {headings.length > 0 && (
                <aside className="hidden lg:block w-56 shrink-0">
                    <nav className="sticky top-24 text-sm space-y-1">
                        <p className="font-semibold mb-2">Daftar Isi</p>
                        {headings.map((h) => (
                            <a
                                key={h.id}
                                href={`#${h.id}`}
                                className={`block text-muted-foreground hover:text-foreground ${
                                    h.level === 3 ? "pl-3" : ""
                                }`}
                            >
                                {h.text}
                            </a>
                        ))}
                    </nav>
                </aside>
            )}
            <article
                className="prose prose-invert max-w-none flex-1"
                dangerouslySetInnerHTML={{ __html: safe }}
            />
        </div>
    );
}
```

**Note:** `sanitizeHtml` is called twice — once on save (Phase 4 actions) and once on render (defense in depth). The second call is cheap because the content is already clean.

**Note on headings with IDs:** For the TOC to work, the Tiptap editor must emit headings with `id` attributes. If it doesn't, the `extractHeadings` regex won't find them, and the TOC will be empty (which is safe — no crash). If you want headings to have IDs, post-process the HTML after saving: replace `<h2>text</h2>` with `<h2 id="slug(text)">text</h2>`. This post-processing can be added to the `createArticleAction`/`updateArticleAction` in Phase 4 as a follow-up.

- [ ] **Step 3: Check if `ArticleBody` is imported elsewhere**

```bash
grep -r "ArticleBody" app/ views/ components/ --include="*.tsx" -l
```

Update any callers that used to pass Markdown content — they should now pass the `content` field (which is HTML after Phase 6 migration).

---

### Task 6: Build and verify

- [ ] **Step 1: Build**

```bash
pnpm build 2>&1 | tee /tmp/phase5-build.log
```

Expected: `✓ Compiled successfully`. No TypeScript errors on `Article` field access.

- [ ] **Step 2: Dev smoke test — articles listing**

```bash
pnpm dev > /tmp/dev-phase5.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/articles
```

Expected: `200` (listing renders, even if empty — shows no articles).

- [ ] **Step 3: If an article exists in DB, test the detail route**

```bash
# Get a slug from the DB first
pnpm tsx -e "
import { db } from './db';
import { articles } from './db/schema';
import { eq } from 'drizzle-orm';
const rows = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.status, 'published')).limit(1);
console.log(rows[0]?.slug ?? 'no published articles');
await process.exit(0);
"
```

If a slug is returned:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/articles/<slug>
```
Expected: `200`.

```bash
kill %1
```

- [ ] **Step 4: Run E2E**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed` (articles spec skips if no published articles in Sanity, which is still running at this phase).

---

### Task 7: Commit

```bash
git add lib/articles.ts app/articles/ components/blog/ArticleBody.tsx
git commit -m "feat: public article read layer + HTML render + ISR (Phase 5)"
```

---

## Self-Review

- **Spec coverage:** §6 (read layer `lib/articles.ts`), §6 (ISR replacing `force-dynamic`), §4/§6 (HTML render in `ArticleBody`).
- **`unstable_cache` + `tags`:** cache is invalidated by `revalidateTag("articles")` from admin actions. `revalidate: 3600` is a fallback TTL.
- **Field name mapping:** `image` ← `coverImageUrl`, `date` ← `publishedAt` — ensures existing view components (`ArticleCard`, etc.) need no changes.
- **TOC from HTML:** regex approach is simple and correct for Tiptap output. No HTML parser dependency needed.
- **Double sanitize:** intentional defense-in-depth; cost is negligible.
- **Sanity still running:** the public pages now read from Postgres. Sanity removal is Phase 8.
