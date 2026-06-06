# Phase 6 — Data Migration: Sanity → Postgres (Markdown → HTML) (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write and run a one-shot migration script (`scripts/migrate-from-sanity.ts`) that fetches all 15 articles from the live Sanity dataset, converts their Markdown body to sanitized HTML, and inserts them into the Postgres `articles` table. The script is idempotent by slug (insert-or-update). After the script runs successfully, the public site reads entirely from Postgres.

**Architecture:** The script is a standalone `tsx` runner — it imports both the existing Sanity client and the new Drizzle `db`. It uses the `marked` library for Markdown-to-HTML conversion, then `sanitizeHtml` from admin-kit for cleanup. It maps Sanity field names to the `articles` table columns defined in Phase 2.

**Tech Stack:** Existing `@sanity/client` (already installed), `marked` (add as devDep), `sanitizeHtml` from `@blawness/admin-kit`, `drizzle-orm`, Sanity GROQ, `SANITY_API_TOKEN` + `DATABASE_URL` in env.

**Prerequisites:** Phases 2 and 5 complete. `DATABASE_URL` and `SANITY_API_TOKEN` both set in `.env.local`. Articles table exists in Neon.

---

## Migration Roadmap (this plan = Phase 6)

1–5. ✓  6. **Phase 6 — Data migration** ← this document
7. Phase 7 — R2 media finalization
8. Phase 8 — Remove Sanity
9. Phase 9 — Update E2E + full verification

---

## Pre-flight

Phase 5 complete. `lib/articles.ts` reading from DB. `DATABASE_URL` and `SANITY_API_TOKEN` set. Working tree clean.

---

### Task 1: Create working branch

```bash
git switch -c phase-6-data-migration
```

---

### Task 2: Install `marked` for Markdown conversion

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Add `marked` as a devDependency**

In `package.json`, add to `devDependencies`:
```json
    "marked": "^12.0.0",
    "@types/marked": "^6.0.0",
```

- [ ] **Step 2: Install**

```bash
pnpm install
```

---

### Task 3: Understand the Sanity article schema

- [ ] **Step 1: Read the current Sanity schema**

```bash
cat sanity/schemas/article.ts
```

Map the Sanity fields to the `articles` table columns:

| Sanity field | `articles` column | Notes |
|---|---|---|
| `_id` | — | Not stored; slug is the dedupe key |
| `title` | `title` | Direct |
| `slug.current` | `slug` | Unwrap |
| `excerpt` | `excerpt` | Direct |
| `body` (Portable Text) | `content` | Convert → HTML |
| `mainImage.asset._ref` | `coverImageUrl` | Build CDN URL via `@sanity/image-url` |
| `category` | `category` | Direct |
| `author` | `author` | Might be a reference; extract `.name` |
| `date` / `_createdAt` | `publishedAt` | Prefer `date` if present |
| `readTime` | `readTime` | Direct; default 5 if missing |
| `tags` | `tags` | Array or empty |

Adjust the field mapping in the script (Task 4) if the real schema differs from the above.

---

### Task 4: Write the migration script

**Files:** `scripts/migrate-from-sanity.ts` (new)

- [ ] **Step 1: Create `scripts/migrate-from-sanity.ts`**

```ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { marked } from "marked";
import { sanitizeHtml } from "@blawness/admin-kit";
import { db } from "../db";
import { articles } from "../db/schema";
import { eq } from "drizzle-orm";

// --- Sanity client ---
const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const builder = imageUrlBuilder(sanity);
function imageUrl(ref: string): string {
    return builder.image(ref).width(1200).url();
}

// --- Fetch all articles from Sanity ---
const GROQ = `*[_type == "article"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  "coverRef": mainImage.asset._ref,
  category,
  "author": coalesce(author->name, author, "Vorca Studio"),
  date,
  readTime,
  tags
}`;

type SanityArticle = {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    body: unknown;          // Portable Text blocks
    coverRef?: string;
    category: string;
    author: string;
    date?: string;
    readTime?: number;
    tags?: string[];
};

// Portable Text → plain text (fallback if marked is not applicable)
function portableTextToMarkdown(body: unknown): string {
    if (!body || !Array.isArray(body)) return "";
    return (body as Array<{ _type: string; style?: string; children?: Array<{ text: string }> }>)
        .filter((b) => b._type === "block")
        .map((b) => {
            const text = (b.children ?? []).map((c) => c.text).join("");
            if (b.style === "h2") return `## ${text}`;
            if (b.style === "h3") return `### ${text}`;
            if (b.style === "blockquote") return `> ${text}`;
            return text;
        })
        .join("\n\n");
}

async function convertBody(body: unknown): Promise<string> {
    const md = portableTextToMarkdown(body);
    const html = await marked(md, { async: false }) as string;
    return sanitizeHtml(html);
}

// --- Main ---
const sanityArticles: SanityArticle[] = await sanity.fetch(GROQ);
console.log(`Fetched ${sanityArticles.length} articles from Sanity.`);

let inserted = 0;
let updated = 0;
let errored = 0;

for (const s of sanityArticles) {
    try {
        const content = await convertBody(s.body);
        const coverImageUrl = s.coverRef ? imageUrl(s.coverRef) : null;
        const publishedAt = s.date ? new Date(s.date) : new Date();

        const existing = await db
            .select({ id: articles.id })
            .from(articles)
            .where(eq(articles.slug, s.slug))
            .limit(1);

        const values = {
            title: s.title,
            slug: s.slug,
            excerpt: s.excerpt ?? "",
            content,
            coverImageUrl,
            category: s.category ?? "Technology",
            author: s.author ?? "Vorca Studio",
            publishedAt,
            readTime: s.readTime ?? 5,
            tags: s.tags ?? [],
            status: "published" as const,
            updatedAt: new Date(),
        };

        if (existing.length > 0) {
            await db.update(articles).set(values).where(eq(articles.slug, s.slug));
            console.log(`  Updated: ${s.slug}`);
            updated++;
        } else {
            await db.insert(articles).values({ ...values, createdAt: publishedAt });
            console.log(`  Inserted: ${s.slug}`);
            inserted++;
        }
    } catch (err) {
        console.error(`  ERROR on ${s.slug}:`, err);
        errored++;
    }
}

console.log(`\nDone. Inserted: ${inserted}, Updated: ${updated}, Errors: ${errored}`);
process.exit(errored > 0 ? 1 : 0);
```

- [ ] **Step 2: Check if `@sanity/image-url` is already installed**

```bash
pnpm why @sanity/image-url | head -3
```

If missing, add to `dependencies`:
```json
    "@sanity/image-url": "^1.0.2",
```
and run `pnpm install`.

- [ ] **Step 3: Verify the required Sanity env vars are set**

```bash
grep -E "NEXT_PUBLIC_SANITY_PROJECT_ID|NEXT_PUBLIC_SANITY_DATASET|SANITY_API_TOKEN" .env.local | wc -l
```

Expected: `3`. If any are missing, check `sanity.config.ts` for the project ID and dataset name.

---

### Task 5: Add migration script to package.json

**Files:** `package.json`

- [ ] **Step 1: Add script**

```json
    "migrate:sanity": "tsx scripts/migrate-from-sanity.ts",
```

---

### Task 6: Run the migration (dry-run first)

- [ ] **Step 1: Run with DRY_RUN to inspect output (optional)**

Add a guard at the top of the script if you want a dry-run mode:
```ts
const DRY_RUN = process.env.DRY_RUN === "1";
```
Then replace `db.insert`/`db.update` calls with `console.log("DRY:", ...)` when `DRY_RUN` is true.

Run:
```bash
DRY_RUN=1 pnpm migrate:sanity
```

Check the output: verify all 15 articles are fetched, slugs look correct, content is not empty.

- [ ] **Step 2: Run the real migration**

```bash
pnpm migrate:sanity
```

Expected output:
```
Fetched 15 articles from Sanity.
  Inserted: <slug>
  ...
Done. Inserted: 15, Updated: 0, Errors: 0
```

Exit code 0.

- [ ] **Step 3: Verify rows in Neon**

```bash
pnpm tsx -e "
import { db } from './db';
import { articles } from './db/schema';
import { eq } from 'drizzle-orm';
const count = await db.select().from(articles).where(eq(articles.status, 'published'));
console.log('Published articles:', count.length);
await process.exit(0);
"
```

Expected: `Published articles: 15`.

---

### Task 7: End-to-end verification — public site reads from Postgres

- [ ] **Step 1: Dev smoke test**

```bash
pnpm dev > /tmp/dev-phase6.log 2>&1 &
sleep 10
curl -s http://localhost:3000/articles | grep -o '<article\|<a href="/articles/' | head -5
```

Expected: article links visible in HTML.

- [ ] **Step 2: Test a specific article**

```bash
# Get first slug from DB
pnpm tsx -e "
import { db } from './db'; import { articles } from './db/schema'; import { eq, desc } from 'drizzle-orm';
const [r] = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.status, 'published')).orderBy(desc(articles.publishedAt)).limit(1);
console.log(r.slug);
await process.exit(0);
"
```

```bash
SLUG=<slug from above>
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/articles/$SLUG
```

Expected: `200`.

```bash
kill %1
```

---

### Task 8: Build verification

- [ ] **Step 1: Production build**

```bash
pnpm build
```

Expected: `✓ Compiled successfully`. `generateStaticParams` for `/articles/[slug]` should now generate 15 static pages.

- [ ] **Step 2: E2E tests**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed`. The `articles.spec.ts` "article can be opened" test should now pass against the Postgres-backed data (the spec fetches `href` from the listing and navigates to it).

---

### Task 9: Commit

```bash
git add scripts/migrate-from-sanity.ts package.json pnpm-lock.yaml
git commit -m "feat: one-shot migration script Sanity -> Postgres Markdown->HTML (Phase 6)"
```

---

## Self-Review

- **Spec coverage:** §8 (migration script, Markdown→HTML, idempotent by slug, `publishedAt` from `date`).
- **`portableTextToMarkdown`:** simplified extraction — handles standard blocks (`h2`, `h3`, `blockquote`, paragraph). Custom marks (bold, italic, links) are stripped to plain text. If fidelity matters, replace with `@portabletext/to-html` (already a transitive dep via sanity package).
- **Cover images:** stored as Sanity CDN URLs. Migrating to R2 is optional (Phase 7); CDN URLs continue to work on the public site until then.
- **Idempotent:** safe to re-run. Uses `update` on slug collision so re-running after a fix doesn't create duplicates.
- **Error handling:** individual article errors are caught and logged; script exits `1` if any errored so CI can detect partial failures.
- **E2E after migration:** `articles.spec.ts` was previously `test.skip` if no Sanity articles — now that Postgres has 15 published articles, the skip condition is false and the test runs for real.
