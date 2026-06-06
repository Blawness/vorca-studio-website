# Phase 2 — Database: Drizzle-kit + Schema + Articles Table (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Neon Postgres to the project via Drizzle ORM, define the full schema (`users` + `media` from admin-kit, `articles` owned by the app), run the initial migration, and verify the DB connection — without changing any product UI.

**Architecture:** `db/schema.ts` re-exports `users`/`media` from `@blawness/admin-kit` and adds the app-owned `articles` table. `db/index.ts` initialises the Drizzle client with `DATABASE_URL`. `drizzle.config.ts` points at `db/` for migrations. All DB work stays in the `db/` tree; no route code touches the DB yet.

**Tech Stack:** `@blawness/admin-kit@^0.2.0` (re-exports schema), `drizzle-orm`, `drizzle-kit`, `postgres` driver, Neon Serverless Postgres (via Vercel Marketplace), `tsx` (for running scripts).

**Prerequisites:** Phase 1 complete and merged. `DATABASE_URL` provisioned in Neon and set in `.env.local`.

---

## Migration Roadmap (this plan = Phase 2)

1. Phase 1 — Next 16 + admin-kit setup ✓
2. **Phase 2 — Database** ← this document
3. Phase 3 — Auth + admin shell + admin-kit screens (login/media/users) + seed admin
4. Phase 4 — Articles admin screen (CRUD + Tiptap editor + R2 cover upload)
5. Phase 5 — Public read layer (`lib/articles.ts`) + HTML render + ISR
6. Phase 6 — Data migration Sanity → Postgres (Markdown→HTML)
7. Phase 7 — R2 media finalization
8. Phase 8 — Remove Sanity + clean deps/overrides
9. Phase 9 — Update E2E + full verification

See spec: `docs/superpowers/specs/2026-06-06-sanity-to-admin-kit-migration-design.md`.

---

## Pre-flight

Phase 1 must be complete: `@blawness/admin-kit` installed, `transpilePackages` wired, `pnpm build` green, `19 passed` E2E. Working tree clean.

---

### Task 1: Create working branch

- [ ] **Step 1: Branch off main (or phase-1 branch if not yet merged)**

```bash
git switch -c phase-2-database
```

---

### Task 2: Provision Neon Postgres

**Files:** `.env.local`, `.env.example`

This step is infrastructure-only. The agent executing this plan cannot provision cloud infra interactively — ask the human to do it if not already done.

- [ ] **Step 1: Confirm DATABASE_URL is set**

```bash
grep -c DATABASE_URL .env.local && echo "FOUND" || echo "MISSING — provision Neon first"
```

If MISSING: go to Vercel Dashboard → Storage → Marketplace → Neon → Create, then copy `DATABASE_URL` (pooled connection string) into `.env.local`.

- [ ] **Step 2: Update .env.example**

Replace the entire `.env.example` with:

```
# Database (Neon Postgres via Vercel Marketplace)
DATABASE_URL=

# Auth (NextAuth v5)
AUTH_SECRET=

# Cloudflare R2 media
R2_BUCKET=
R2_PUBLIC_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=

# Email (Resend — contact form)
RESEND_API_KEY=

# Sanity CMS (deprecated — remove after Phase 8)
SANITY_API_TOKEN=
```

---

### Task 3: Install Drizzle dependencies

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Add dependencies**

In `package.json`, add to `dependencies`:
```json
    "drizzle-orm": "^0.44.0",
    "postgres": "^3.4.5",
```

Add to `devDependencies`:
```json
    "drizzle-kit": "^0.31.0",
```

- [ ] **Step 2: Install**

```bash
pnpm install
```

Expected: exit 0, no peer-dep errors.

- [ ] **Step 3: Confirm packages resolved**

```bash
pnpm why drizzle-orm | head -5
pnpm why drizzle-kit | head -5
```

Expected: both listed as direct dependencies.

---

### Task 4: Create the Drizzle config

**Files:** `drizzle.config.ts` (new)

- [ ] **Step 1: Create `drizzle.config.ts` at project root**

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
```

---

### Task 5: Create the DB client

**Files:** `db/index.ts` (new)

- [ ] **Step 1: Create `db/index.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });
```

`prepare: false` is required for Neon's connection pooler (pgBouncer in transaction mode does not support prepared statements).

---

### Task 6: Define the full schema

**Files:** `db/schema.ts` (new)

- [ ] **Step 1: Create `db/schema.ts`**

Re-export the admin-kit built-in tables (`users`, `media`) and define the app-owned `articles` table:

```ts
export { users, media } from "@blawness/admin-kit/schema";

import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull().default(""),
    coverImageUrl: text("cover_image_url"),
    category: text("category").notNull(),
    author: text("author").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    readTime: integer("read_time").notNull().default(0),
    tags: text("tags").array().notNull().default([]),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

---

### Task 7: Add migration scripts to package.json

**Files:** `package.json`

- [ ] **Step 1: Add drizzle scripts**

In `package.json` `"scripts"` block, add:
```json
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push",
```

---

### Task 8: Generate and run the initial migration

**Files:** `db/migrations/` (generated)

- [ ] **Step 1: Generate migration SQL**

```bash
pnpm db:generate
```

Expected: `db/migrations/0000_*.sql` created containing `CREATE TABLE "users"`, `CREATE TABLE "media"`, `CREATE TABLE "articles"`.

- [ ] **Step 2: Inspect the generated SQL**

```bash
cat db/migrations/0000_*.sql
```

Verify all three tables are present with correct column names and types.

- [ ] **Step 3: Run the migration against Neon**

```bash
pnpm db:migrate
```

Expected: exit 0, migration applied.

- [ ] **Step 4: Verify tables exist in Neon**

Run a quick inline check:

```bash
pnpm tsx -e "
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
const rows = await sql\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name\`;
console.log(rows.map((r: { table_name: string }) => r.table_name));
await sql.end();
"
```

Expected output includes: `articles`, `media`, `users` (plus Drizzle's `__drizzle_migrations` meta table).

---

### Task 9: Add `db/` migrations directory to .gitignore exclusions (keep migrations)

**Files:** `.gitignore`

Migrations are generated files but must be committed (they are the source of truth for schema).

- [ ] **Step 1: Verify `db/migrations/` is NOT in .gitignore**

```bash
grep -n "migrations" .gitignore || echo "not listed — good"
```

If listed, remove the line. Generated SQL migrations must be version-controlled.

---

### Task 10: Build verification

- [ ] **Step 1: Run production build**

```bash
pnpm build
```

Expected: `✓ Compiled successfully`. The `db/` tree is not imported by any route yet, so it may warn about unused exports — that is fine.

- [ ] **Step 2: Run E2E tests**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed`. No regressions.

---

### Task 11: Commit

- [ ] **Step 1: Commit all changes**

```bash
git add package.json pnpm-lock.yaml drizzle.config.ts db/ .env.example
git commit -m "feat: add Drizzle ORM + articles schema + Neon migration (Phase 2)"
```

---

## Self-Review

- **Spec coverage:** §2 (DB: drizzle-kit, schema, articles table, DATABASE_URL, migrate).
- **Placeholders:** none — every step has concrete commands/code.
- **`prepare: false`:** required for Neon pooler; critical to note for future devs.
- **Schema alignment:** `articles` columns match spec §4 data model exactly.
- **Re-export pattern:** `users`/`media` re-exported from admin-kit avoids schema duplication and keeps admin-kit as single source of truth for its own tables.
- **No product change:** zero routes touched, E2E remains green.
