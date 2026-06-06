# Phase 7 — R2 Media Finalization (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure `next/image` can load cover images served from Cloudflare R2 (via `R2_PUBLIC_URL`), add the R2 host to `next.config.mjs` `images.remotePatterns`, and optionally back-fill the existing 15 migrated articles' cover images from Sanity CDN URLs to R2. The public site and admin media library must work with R2-hosted media.

**Architecture:** Two sub-tasks:
1. **Config** — add `R2_PUBLIC_URL` host to `next.config.mjs` remotePatterns so `<Image>` does not throw on R2 URLs.
2. **Backfill (optional but recommended)** — a one-shot script copies each migrated article's Sanity CDN cover image to R2 and updates `coverImageUrl` in the DB.

The backfill is "optional" in the sense that the site works without it (Sanity CDN URLs are valid HTTPS and `next/image` can use them if allowed as a remote pattern). It becomes necessary after Phase 8 removes Sanity entirely, at which point all Sanity CDN assets may 404 if the Sanity project is deleted. Doing the backfill now avoids that risk.

**Tech Stack:** `@blawness/admin-kit` (`uploadImage`, `deleteObjectByUrl`), `@aws-sdk/client-s3` (transitive via admin-kit), `node:https` or `fetch` (to download Sanity images), `drizzle-orm`, R2 env vars.

**Prerequisites:** Phase 6 complete. 15 articles migrated into Postgres. R2 bucket created, credentials in `.env.local`.

---

## Migration Roadmap (this plan = Phase 7)

1–6. ✓  7. **Phase 7 — R2 media** ← this document
8. Phase 8 — Remove Sanity
9. Phase 9 — Update E2E + full verification

---

## Pre-flight

Phase 6 complete. 15 articles in Postgres. R2 env vars set. Working tree clean.

---

### Task 1: Create working branch

```bash
git switch -c phase-7-r2-media
```

---

### Task 2: Wire R2 host to next/image remotePatterns

**Files:** `next.config.mjs`

- [ ] **Step 1: Read current `next.config.mjs`**

```bash
cat next.config.mjs
```

- [ ] **Step 2: Add R2_PUBLIC_URL to remotePatterns**

The `R2_PUBLIC_URL` env var is a URL like `https://pub-<hash>.r2.dev` or a custom domain. We extract just the hostname at build time:

```js
const r2Host = process.env.R2_PUBLIC_URL
    ? new URL(process.env.R2_PUBLIC_URL).hostname
    : null;

const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@blawness/admin-kit"],
    images: {
        remotePatterns: [
            // Sanity CDN (keep until Phase 8 backfill is confirmed complete)
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
            // Cloudflare R2
            ...(r2Host
                ? [{ protocol: "https", hostname: r2Host }]
                : []),
        ],
    },
};
```

Replace the existing `images: { remotePatterns: [] }` with the above. Keep the `cdn.sanity.io` entry until Phase 8 confirms all cover images are on R2.

- [ ] **Step 3: Build to verify no TypeScript errors**

```bash
pnpm build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

---

### Task 3: (Optional) Backfill cover images from Sanity CDN to R2

**Files:** `scripts/backfill-covers-to-r2.ts` (new)

This script downloads each article's current `coverImageUrl` (Sanity CDN), uploads it to R2, and updates the DB row. It skips articles already pointing to `R2_PUBLIC_URL`.

- [ ] **Step 1: Create `scripts/backfill-covers-to-r2.ts`**

```ts
import { db } from "../db";
import { articles } from "../db/schema";
import { eq, isNotNull } from "drizzle-orm";
import { uploadImage, deleteObjectByUrl } from "@blawness/admin-kit";
import { slugify } from "@blawness/admin-kit";

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
if (!R2_PUBLIC_URL) {
    console.error("R2_PUBLIC_URL is not set");
    process.exit(1);
}

async function downloadAsBuffer(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
}

const rows = await db
    .select({ id: articles.id, title: articles.title, coverImageUrl: articles.coverImageUrl })
    .from(articles)
    .where(isNotNull(articles.coverImageUrl));

console.log(`Found ${rows.length} articles with cover images.`);

let copied = 0;
let skipped = 0;
let errored = 0;

for (const row of rows) {
    const url = row.coverImageUrl!;
    if (url.startsWith(R2_PUBLIC_URL)) {
        console.log(`  SKIP (already R2): ${row.title}`);
        skipped++;
        continue;
    }

    try {
        const buffer = await downloadAsBuffer(url);
        const keyBase = `covers/${slugify(row.title)}`;
        const { url: r2Url } = await uploadImage(buffer, keyBase);

        await db
            .update(articles)
            .set({ coverImageUrl: r2Url, updatedAt: new Date() })
            .where(eq(articles.id, row.id));

        console.log(`  Copied: ${row.title} → ${r2Url}`);
        copied++;
    } catch (err) {
        console.error(`  ERROR on "${row.title}":`, err);
        errored++;
    }
}

console.log(`\nDone. Copied: ${copied}, Skipped: ${skipped}, Errors: ${errored}`);
process.exit(errored > 0 ? 1 : 0);
```

- [ ] **Step 2: Add script to package.json**

```json
    "backfill:covers": "tsx scripts/backfill-covers-to-r2.ts",
```

- [ ] **Step 3: Run the backfill**

```bash
pnpm backfill:covers
```

Expected: `Done. Copied: 15, Skipped: 0, Errors: 0`.

If any error, check the specific Sanity CDN URL — if a `SANITY_API_TOKEN` read token is needed for the asset, set it; otherwise the URL may be public.

- [ ] **Step 4: After successful backfill, remove `cdn.sanity.io` from remotePatterns**

In `next.config.mjs`, remove the `cdn.sanity.io` entry from `remotePatterns`. This is fine to do now since all covers are on R2.

Build again:
```bash
pnpm build
```

---

### Task 4: Verify next/image loads R2 images

- [ ] **Step 1: Pick an R2 cover URL from the DB**

```bash
pnpm tsx -e "
import { db } from './db'; import { articles } from './db/schema'; import { isNotNull } from 'drizzle-orm';
const [r] = await db.select({ coverImageUrl: articles.coverImageUrl }).from(articles).where(isNotNull(articles.coverImageUrl)).limit(1);
console.log(r?.coverImageUrl);
await process.exit(0);
"
```

- [ ] **Step 2: Verify the URL returns 200**

```bash
curl -s -o /dev/null -w "%{http_code}\n" "<R2 URL from step 1>"
```

Expected: `200`.

- [ ] **Step 3: Dev smoke test — article listing shows images**

```bash
pnpm dev > /tmp/dev-phase7.log 2>&1 &
sleep 10
curl -s http://localhost:3000/articles | grep -o "r2\.dev\|R2_PUBLIC_URL_HOST" | head -3
kill %1
```

The hostname from your `R2_PUBLIC_URL` should appear in the page HTML.

---

### Task 5: E2E and build gate

- [ ] **Step 1: E2E**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed`.

- [ ] **Step 2: Final build**

```bash
pnpm build
```

Expected: `✓ Compiled successfully`.

---

### Task 6: Commit

```bash
git add next.config.mjs scripts/backfill-covers-to-r2.ts package.json pnpm-lock.yaml
git commit -m "feat: wire R2 remotePatterns + backfill cover images from Sanity CDN (Phase 7)"
```

---

## Self-Review

- **Spec coverage:** §7 (R2 remotePatterns, `uploadImage`, cover image URL update in DB).
- **`cdn.sanity.io` removal gated on backfill:** prevents 404s on article covers if the entry is removed before all images are on R2.
- **`uploadImage` key:** `covers/<slugified-title>` — unique per article, no collision risk since slugs are unique.
- **Idempotent backfill:** skips rows whose `coverImageUrl` already starts with `R2_PUBLIC_URL`, so safe to re-run.
- **No auth token needed for Sanity image downloads:** Sanity CDN image assets are publicly accessible by URL (no token required for reads). If a custom CDN with auth is used, the fetch call needs an Authorization header.
