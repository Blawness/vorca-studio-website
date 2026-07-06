# Client Project Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Vorca clients a logged-in portal to monitor their own project(s) — brief/PRD, stage & progress, timeline updates, tasks, and deliverables they can approve or request revisions on — all managed from the existing admin CMS.

**Architecture:** Reuse admin-kit NextAuth + `users` table with a new `client` RBAC role. New app-local Drizzle tables (`projects`, `projectUpdates`, `projectTasks`, `deliverables`, `deliverableEvents`). A custom admin screen manages them (mirrors the existing `articles` screen). A separate `(portal)` route group serves clients, guarded by a custom `requireClient()` + per-query ownership filtering. Portal reads are uncached (`force-dynamic`); public site caching is untouched.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Drizzle ORM (postgres-js/Neon), NextAuth v5 via `@blawness/admin-kit`, Tailwind v4, Playwright (e2e), bcryptjs, nanoid.

## Global Constraints

- **User/PK id type is integer.** admin-kit `users.id` is `serial`; `requireUserId()` returns `number`. All FKs to `users.id` are `integer`; all new table PKs are `serial`.
- **Drizzle client uses `prepare: false`** (Neon pooled) — already configured in `db/index.ts`; do not change.
- **Migrations are generated, never hand-written.** Run `pnpm db:generate` then `pnpm db:migrate`. Drizzle reads env from `.env` then `.env.local`.
- **All portal reads must filter by `clientUserId` at the query level**, never post-filter. Every portal write action re-checks ownership server-side.
- **Portal routes are uncached**: every portal route file sets `export const dynamic = "force-dynamic"`. Do NOT wrap portal reads in `unstable_cache`.
- **Sanitize HTML on save and on render.** Use `sanitizeHtml` from `@blawness/admin-kit` in server actions; use `buildArticleHtml`/`extractHeadingsFromHtml` from `lib/article-html.ts` when rendering PRD.
- **All portal UI chrome labels go through `LanguageContext`** (`useLanguage().t(key)`), with keys added to BOTH `id` and `en` maps in `contexts/LanguageContext.tsx`. Staff-authored content (PRD, update bodies) is free-text, not translated.
- **`proxy.ts` matcher stays `["/admin/:path*"]`** — do not add `/portal`. Portal is guarded in its layout.
- **Path alias:** `@/*` → repo root.
- **This repo's only test runner is Playwright** (`pnpm test:e2e`, config auto-starts `pnpm dev`). User-facing behavior is tested with Playwright e2e. Infra/logic tasks are verified with `pnpm lint` + `pnpm build` + explicit DB/CLI checks described in-task.

---

## File Structure

**Created:**
- `lib/project-slug.ts` — non-guessable slug generator (nanoid).
- `lib/portal-auth.ts` — `requireClient()` guard.
- `lib/projects.ts` — portal read layer (ownership-filtered).
- `app/(admin)/admin/(protected)/projects/page.tsx` — admin project list.
- `app/(admin)/admin/(protected)/projects/new/page.tsx` — create form host.
- `app/(admin)/admin/(protected)/projects/[id]/page.tsx` — edit form host + sub-entity management.
- `app/(admin)/admin/(protected)/projects/_components/ProjectForm.tsx` — main create/edit form (client).
- `app/(admin)/admin/(protected)/projects/_components/SubEntityManager.tsx` — updates/tasks/deliverables management UI (client).
- `app/(admin)/admin/(protected)/projects/actions.ts` — all admin server actions.
- `app/(portal)/portal/layout.tsx` — portal chrome.
- `app/(portal)/portal/login/page.tsx` — client login page host.
- `app/(portal)/portal/login/LoginForm.tsx` — client login form (client).
- `app/(portal)/portal/login/actions.ts` — `clientSignIn` server action.
- `app/(portal)/portal/(protected)/layout.tsx` — `requireClient()` guard.
- `app/(portal)/portal/(protected)/page.tsx` — client project list.
- `app/(portal)/portal/(protected)/[slug]/page.tsx` — project dashboard.
- `app/(portal)/portal/(protected)/[slug]/DeliverableActions.tsx` — approve/revise UI (client).
- `app/(portal)/portal/(protected)/[slug]/actions.ts` — `approveDeliverable` / `requestRevision`.
- `scripts/seed-client.ts` — dev/e2e client + project seed.
- `e2e/portal.spec.ts` — portal e2e tests.

**Modified:**
- `db/schema.ts` — append project tables.
- `rbac.ts` — add `client` role + `projects.*` permissions.
- `app/(admin)/admin/(protected)/nav-icons.ts` — export `FolderKanban`.
- `app/(admin)/admin/(protected)/layout.tsx` — add "Projects" nav item.
- `contexts/LanguageContext.tsx` — add portal UI keys (both languages).
- `package.json` — add `nanoid` dep + `seed:client` script.

---

## Task 1: Database schema, migration & slug helper

**Files:**
- Modify: `db/schema.ts`
- Create: `lib/project-slug.ts`
- Modify: `package.json` (add `nanoid`)
- Generated: `db/migrations/000X_*.sql`

**Interfaces:**
- Produces: Drizzle tables `projects`, `projectUpdates`, `projectTasks`, `deliverables`, `deliverableEvents` (exported from `@/db/schema`). Enums `projectStage`, `taskStatus`, `approvalStatus`, `deliverableAction`. `generateProjectSlug(): string` from `@/lib/project-slug`.

- [ ] **Step 1: Add nanoid dependency**

Run: `pnpm add nanoid`
Expected: `nanoid` appears in `package.json` dependencies.

- [ ] **Step 2: Create the slug helper**

Create `lib/project-slug.ts`:

```ts
import { customAlphabet } from "nanoid";

// URL-safe, unambiguous alphabet (no look-alike chars). 12 chars ≈ 71 bits —
// non-guessable, defense-in-depth above auth.
const nano = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 12);

export function generateProjectSlug(): string {
    return nano();
}
```

- [ ] **Step 3: Append project tables to `db/schema.ts`**

`db/schema.ts` currently is only `export * from "@blawness/admin-kit/schema";`. Keep that line and append:

```ts
export * from "@blawness/admin-kit/schema";

import {
    pgTable,
    serial,
    integer,
    text,
    date,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "@blawness/admin-kit/schema";

export const projectStage = pgEnum("project_stage", [
    "planning",
    "design",
    "development",
    "review",
    "completed",
]);
export const taskStatus = pgEnum("task_status", ["todo", "in_progress", "done"]);
export const approvalStatus = pgEnum("approval_status", [
    "pending",
    "approved",
    "revision_requested",
]);
export const deliverableAction = pgEnum("deliverable_action", [
    "approved",
    "revision_requested",
]);

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    prd: text("prd"),
    clientUserId: integer("client_user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    stage: projectStage("stage").notNull().default("planning"),
    progress: integer("progress").notNull().default(0),
    liveUrl: text("live_url"),
    startDate: date("start_date"),
    targetDate: date("target_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectUpdates = pgTable("project_updates", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectTasks = pgTable("project_tasks", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    status: taskStatus("status").notNull().default("todo"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliverables = pgTable("deliverables", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    fileUrl: text("file_url"),
    previewUrl: text("preview_url"),
    approvalStatus: approvalStatus("approval_status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliverableEvents = pgTable("deliverable_events", {
    id: serial("id").primaryKey(),
    deliverableId: integer("deliverable_id")
        .notNull()
        .references(() => deliverables.id, { onDelete: "cascade" }),
    action: deliverableAction("action").notNull(),
    note: text("note"),
    actorUserId: integer("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

- [ ] **Step 4: Generate the migration**

Run: `pnpm db:generate`
Expected: a new file `db/migrations/000X_*.sql` containing `CREATE TABLE "projects"`, `"project_updates"`, `"project_tasks"`, `"deliverables"`, `"deliverable_events"` and the four `CREATE TYPE` enum statements. Inspect the SQL to confirm FKs and `ON DELETE cascade`.

- [ ] **Step 5: Apply the migration**

Run: `pnpm db:migrate`
Expected: migration applies with no error.

- [ ] **Step 6: Verify tables exist**

Run: `pnpm db:studio` is interactive; instead verify programmatically:
```bash
node --input-type=module -e "import('dotenv').then(d=>{d.config({path:'.env'});d.config({path:'.env.local',override:true});return import('./db/index.ts')}).then(async({db})=>{const s=await import('./db/schema.ts');const r=await db.select().from(s.projects).limit(1);console.log('projects table OK, rows:',r.length);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})"
```
Expected: `projects table OK, rows: 0` (tsx may be needed; if this errors on TS import, run via `pnpm exec tsx` with an equivalent script). If the node TS import fails in your environment, instead run `pnpm build` (Step 7) which type-checks the schema import.

- [ ] **Step 7: Typecheck build**

Run: `pnpm build`
Expected: build succeeds (schema compiles, no type errors).

- [ ] **Step 8: Commit**

```bash
git add db/schema.ts lib/project-slug.ts package.json pnpm-lock.yaml db/migrations
git commit -m "feat: add project portal database schema and slug helper"
```

---

## Task 2: RBAC — client role & project permissions

**Files:**
- Modify: `rbac.ts`

**Interfaces:**
- Produces: role `client` (no admin permissions) and permissions `projects.read|create|update|delete` granted to `admin` (via `*`) and `editor`. `rbac.can(role, perm)` reflects this.

- [ ] **Step 1: Write a verification script (the "failing test")**

Create a throwaway check file `scripts/_rbac-check.mjs`:

```js
import "dotenv/config";
const { rbac } = await import("../rbac.ts");
const checks = [
    ["admin", "projects.read", true],
    ["editor", "projects.update", true],
    ["editor", "projects.delete", true],
    ["client", "projects.read", false],
    ["client", "users.read", false],
    ["client", "articles.read", false],
];
let ok = true;
for (const [role, perm, want] of checks) {
    const got = rbac.can(role, perm);
    if (got !== want) { ok = false; console.error(`FAIL ${role} ${perm}: got ${got} want ${want}`); }
}
console.log(ok ? "RBAC OK" : "RBAC FAILED");
process.exit(ok ? 0 : 1);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec tsx scripts/_rbac-check.mjs`
Expected: FAIL lines for `editor projects.update` and/or the `client` role not existing yet (or `projects.*` unknown → `admin` may pass via `*` but `editor` fails).

- [ ] **Step 3: Update `rbac.ts`**

Replace the contents of `rbac.ts` with:

```ts
import { defineRbac, presets } from "@blawness/admin-kit/rbac";

const editorPerms = presets.adminEditor.editor;

export const rbac = defineRbac({
    roles: {
        admin: ["*"],
        editor: [
            ...editorPerms,
            "projects.read",
            "projects.create",
            "projects.update",
            "projects.delete",
        ],
        // Clients authenticate through the same NextAuth instance but hold NO
        // admin permissions — the portal authorizes them by role + ownership,
        // not by these permissions. An empty list keeps every CMS screen closed.
        client: [],
    },
    fallbackRole: "editor",
    protectedPermission: "users.delete",
});
```

> If `presets.adminEditor.editor` is not directly indexable at runtime, inline the legacy editor scopes explicitly: `["articles.read","articles.create","articles.update","media.read","media.upload","profile.edit"]` plus the four `projects.*`.

- [ ] **Step 4: Run the check to verify it passes**

Run: `pnpm exec tsx scripts/_rbac-check.mjs`
Expected: `RBAC OK`, exit 0.

- [ ] **Step 5: Remove the throwaway check**

Run: `rm scripts/_rbac-check.mjs`

- [ ] **Step 6: Commit**

```bash
git add rbac.ts
git commit -m "feat: add client role and project permissions to RBAC"
```

---

## Task 3: `requireClient()` portal guard

**Files:**
- Create: `lib/portal-auth.ts`

**Interfaces:**
- Consumes: `auth` from `@blawness/admin-kit/auth`.
- Produces: `requireClient(): Promise<{ userId: number; name: string; email: string }>` — redirects to `/portal/login` if unauthenticated OR role !== "client".

- [ ] **Step 1: Create `lib/portal-auth.ts`**

```ts
import { redirect } from "next/navigation";
import { auth } from "@blawness/admin-kit/auth";

export type PortalClient = { userId: number; name: string; email: string };

/**
 * Guards the client portal. Unlike admin-kit's requireUser() (which redirects
 * to /admin/login), this sends non-clients to the portal login. Role must be
 * exactly "client" — staff roles are rejected so the portal never leaks a
 * staff session into a client surface.
 */
export async function requireClient(): Promise<PortalClient> {
    const session = await auth();
    const user = session?.user as
        | { id?: string | number; role?: string; name?: string; email?: string }
        | undefined;

    if (!user || user.role !== "client") {
        redirect("/portal/login");
    }

    const userId = Number(user.id);
    if (!Number.isInteger(userId)) {
        redirect("/portal/login");
    }

    return { userId, name: user.name ?? "", email: user.email ?? "" };
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm build`
Expected: build succeeds. (Behavioral verification happens via e2e in Task 9/10.)

- [ ] **Step 3: Commit**

```bash
git add lib/portal-auth.ts
git commit -m "feat: add requireClient portal auth guard"
```

---

## Task 4: Portal read layer (`lib/projects.ts`)

**Files:**
- Create: `lib/projects.ts`

**Interfaces:**
- Consumes: `db` from `@/db`, tables from `@/db/schema`.
- Produces:
  - `type ClientProjectSummary = { id: number; slug: string; name: string; stage: string; progress: number; targetDate: string | null }`
  - `type ClientProjectDetail = { id, slug, name, description, prd, stage, progress, liveUrl, startDate, targetDate, updates: {...}[], tasks: {...}[], deliverables: { id, title, fileUrl, previewUrl, approvalStatus, events: {...}[] }[] }`
  - `getClientProjects(userId: number): Promise<ClientProjectSummary[]>`
  - `getClientProject(userId: number, slug: string): Promise<ClientProjectDetail | null>`
  - `getDeliverableOwner(deliverableId: number): Promise<number | null>` — returns the owning `clientUserId`, or null if not found. Used by write actions to verify ownership.

- [ ] **Step 1: Create `lib/projects.ts`**

```ts
import "server-only";
import { db } from "@/db";
import {
    projects,
    projectUpdates,
    projectTasks,
    deliverables,
    deliverableEvents,
} from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";

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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/projects.ts
git commit -m "feat: add ownership-filtered portal read layer"
```

---

## Task 5: Seed script for a client + project

**Files:**
- Create: `scripts/seed-client.ts`
- Modify: `package.json` (add `seed:client` script)

**Interfaces:**
- Produces: an npm script `seed:client` that upserts a client user (env `CLIENT_EMAIL`/`CLIENT_PASSWORD`) and, if none exists for them, one sample project with a known slug printed to stdout. Used by e2e tests and dev.

- [ ] **Step 1: Create `scripts/seed-client.ts`**

```ts
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { eq } from "drizzle-orm";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const [{ db }, schema] = await Promise.all([
    import("../db"),
    import("../db/schema"),
]);
const { users, projects, projectUpdates, projectTasks, deliverables } = schema;

const EMAIL = process.env.CLIENT_EMAIL ?? "client@example.com";
const PASSWORD = process.env.CLIENT_PASSWORD ?? "client-password-123";

const passwordHash = await bcrypt.hash(PASSWORD, 12);

let [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, EMAIL)).limit(1);
if (user) {
    await db.update(users).set({ passwordHash, role: "client" }).where(eq(users.id, user.id));
} else {
    [user] = await db
        .insert(users)
        .values({ email: EMAIL, name: "Sample Client", passwordHash, role: "client" })
        .returning({ id: users.id });
}

const existing = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.clientUserId, user.id))
    .limit(1);

if (existing.length === 0) {
    const slug = "seed-project-001";
    const [project] = await db
        .insert(projects)
        .values({
            slug,
            name: "Sample Website Project",
            description: "A demo project for the client portal.",
            prd: "<h2>Scope</h2><p>Build a marketing site.</p>",
            clientUserId: user.id,
            stage: "development",
            progress: 45,
            liveUrl: "https://example.com",
        })
        .returning({ id: projects.id });

    await db.insert(projectUpdates).values({
        projectId: project.id,
        title: "Kickoff complete",
        body: "We started development this week.",
    });
    await db.insert(projectTasks).values([
        { projectId: project.id, title: "Design homepage", status: "done", sortOrder: 0 },
        { projectId: project.id, title: "Build homepage", status: "in_progress", sortOrder: 1 },
        { projectId: project.id, title: "Launch", status: "todo", sortOrder: 2 },
    ]);
    await db.insert(deliverables).values({
        projectId: project.id,
        title: "Homepage design",
        previewUrl: "https://example.com/preview",
        approvalStatus: "pending",
    });
    console.log(`Created client ${EMAIL} + project slug: ${slug}`);
} else {
    console.log(`Client ${EMAIL} already has project slug: ${existing[0].slug}`);
}

process.exit(0);
```

- [ ] **Step 2: Add the script to `package.json`**

Under `"scripts"`, next to `"seed:admin"`, add:
```json
"seed:client": "tsx scripts/seed-client.ts",
```

- [ ] **Step 3: Run it**

Run: `CLIENT_EMAIL=client@example.com CLIENT_PASSWORD=client-password-123 pnpm seed:client`
Expected: prints `Created client client@example.com + project slug: seed-project-001` (or the "already has" line on reruns).

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-client.ts package.json
git commit -m "feat: add seed:client script for portal dev and tests"
```

---

## Task 6: Admin — server actions, project list & nav

**Files:**
- Create: `app/(admin)/admin/(protected)/projects/actions.ts`
- Create: `app/(admin)/admin/(protected)/projects/page.tsx`
- Modify: `app/(admin)/admin/(protected)/nav-icons.ts`
- Modify: `app/(admin)/admin/(protected)/layout.tsx`

**Interfaces:**
- Consumes: `requirePermission` from `@blawness/admin-kit/auth-helpers`, `db`, schema tables, `generateProjectSlug`, `sanitizeHtml`.
- Produces server actions: `createProjectAction(formData)`, `updateProjectAction(id: number, formData)`, `deleteProjectFormAction(formData)`, `addUpdateAction(formData)`, `deleteUpdateFormAction(formData)`, `addTaskAction(formData)`, `updateTaskAction(formData)`, `deleteTaskFormAction(formData)`, `addDeliverableAction(formData)`, `deleteDeliverableFormAction(formData)`. All gated by `requirePermission("projects.*")`.

- [ ] **Step 1: Create `actions.ts`**

```ts
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
```

- [ ] **Step 2: Create the project list page `page.tsx`**

```tsx
import Link from "next/link";
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteProjectFormAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
    const rows = await db
        .select({
            id: projects.id,
            name: projects.name,
            slug: projects.slug,
            stage: projects.stage,
            progress: projects.progress,
            client: users.name,
        })
        .from(projects)
        .leftJoin(users, eq(projects.clientUserId, users.id))
        .orderBy(projects.createdAt);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <Link
                    href="/admin/projects/new"
                    className="rounded bg-navy px-4 py-2 text-sm font-medium text-white"
                >
                    New project
                </Link>
            </div>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-gray-500">
                        <th className="py-2">Name</th>
                        <th>Client</th>
                        <th>Stage</th>
                        <th>Progress</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((p) => (
                        <tr key={p.id} className="border-b">
                            <td className="py-2">
                                <Link className="text-brand hover:underline" href={`/admin/projects/${p.id}`}>
                                    {p.name}
                                </Link>
                            </td>
                            <td>{p.client ?? "—"}</td>
                            <td>{p.stage}</td>
                            <td>{p.progress}%</td>
                            <td className="text-right">
                                <form action={deleteProjectFormAction}>
                                    <input type="hidden" name="id" value={p.id} />
                                    <button className="text-red-600 hover:underline" type="submit">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-400">
                                No projects yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
```

- [ ] **Step 3: Add the `FolderKanban` icon export**

In `app/(admin)/admin/(protected)/nav-icons.ts`, add `FolderKanban` to the lucide re-exports (match the existing export style in that file, e.g. `export { FolderKanban } from "lucide-react";` or add it to the existing export list).

- [ ] **Step 4: Add the nav item**

In `app/(admin)/admin/(protected)/layout.tsx`:
- Add `FolderKanban` to the import from `"./nav-icons"`.
- Add this entry to `navItems` (after "Artikel"):
```tsx
{ label: "Projects", href: "/admin/projects", icon: <FolderKanban className="h-4 w-4" />, requires: "projects.read" },
```

- [ ] **Step 5: Verify build + manual smoke**

Run: `pnpm build`
Expected: build succeeds.
Then run `pnpm dev`, log in as admin, visit `/admin/projects` — the "Projects" nav item shows and the (empty or seeded) list renders.

- [ ] **Step 6: Commit**

```bash
git add "app/(admin)/admin/(protected)/projects/actions.ts" "app/(admin)/admin/(protected)/projects/page.tsx" "app/(admin)/admin/(protected)/nav-icons.ts" "app/(admin)/admin/(protected)/layout.tsx"
git commit -m "feat: add admin projects list, nav item, and server actions"
```

---

## Task 7: Admin — create/edit form & sub-entity management

**Files:**
- Create: `app/(admin)/admin/(protected)/projects/_components/ProjectForm.tsx`
- Create: `app/(admin)/admin/(protected)/projects/_components/SubEntityManager.tsx`
- Create: `app/(admin)/admin/(protected)/projects/new/page.tsx`
- Create: `app/(admin)/admin/(protected)/projects/[id]/page.tsx`

**Interfaces:**
- Consumes: actions from `../actions`, `Editor` from `@blawness/admin-kit/components`, `ImageUpload`/`uploadImageAction` are not needed (files use `uploadFile`; for v1 the deliverable form takes URLs — file upload uses the existing Media library, and the staff paste the resulting URL). `getClientProject`-style data is read directly in the page.
- Produces: `ProjectForm` (client) bound to create or update; `SubEntityManager` (client) rendering updates/tasks/deliverables lists with add/delete forms.

- [ ] **Step 1: Create `ProjectForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Editor } from "@blawness/admin-kit/components";

type ClientOption = { id: number; name: string | null; email: string };

export type ProjectFormValues = {
    id?: number;
    name: string;
    description: string;
    prd: string;
    clientUserId: number | "";
    stage: string;
    progress: number;
    liveUrl: string;
    startDate: string;
    targetDate: string;
};

export function ProjectForm({
    initial,
    clients,
    action,
}: {
    initial: ProjectFormValues;
    clients: ClientOption[];
    action: (formData: FormData) => void;
}) {
    const [prd, setPrd] = useState(initial.prd);

    return (
        <form action={action} className="max-w-2xl space-y-4">
            <input type="hidden" name="prd" value={prd} />

            <label className="block">
                <span className="text-sm font-medium">Name</span>
                <input name="name" defaultValue={initial.name} required className="mt-1 w-full rounded border px-3 py-2" />
            </label>

            <label className="block">
                <span className="text-sm font-medium">Description</span>
                <textarea name="description" defaultValue={initial.description} className="mt-1 w-full rounded border px-3 py-2" />
            </label>

            <label className="block">
                <span className="text-sm font-medium">Client</span>
                <select name="clientUserId" defaultValue={initial.clientUserId} required className="mt-1 w-full rounded border px-3 py-2">
                    <option value="" disabled>Select a client…</option>
                    {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name ?? c.email}</option>
                    ))}
                </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-sm font-medium">Stage</span>
                    <select name="stage" defaultValue={initial.stage} className="mt-1 w-full rounded border px-3 py-2">
                        {["planning", "design", "development", "review", "completed"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Progress: {initial.progress}%</span>
                    <input type="range" name="progress" min={0} max={100} defaultValue={initial.progress} className="mt-3 w-full" />
                </label>
            </div>

            <label className="block">
                <span className="text-sm font-medium">Live URL</span>
                <input name="liveUrl" type="url" defaultValue={initial.liveUrl} placeholder="https://…" className="mt-1 w-full rounded border px-3 py-2" />
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-sm font-medium">Start date</span>
                    <input name="startDate" type="date" defaultValue={initial.startDate} className="mt-1 w-full rounded border px-3 py-2" />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Target date</span>
                    <input name="targetDate" type="date" defaultValue={initial.targetDate} className="mt-1 w-full rounded border px-3 py-2" />
                </label>
            </div>

            <div>
                <span className="text-sm font-medium">PRD / Brief</span>
                <div className="mt-1 rounded border">
                    <Editor value={prd} onChange={setPrd} />
                </div>
            </div>

            <button type="submit" className="rounded bg-navy px-4 py-2 text-sm font-medium text-white">
                Save project
            </button>
        </form>
    );
}
```

- [ ] **Step 2: Create `SubEntityManager.tsx`**

```tsx
import {
    addUpdateAction,
    deleteUpdateFormAction,
    addTaskAction,
    updateTaskAction,
    deleteTaskFormAction,
    addDeliverableAction,
    deleteDeliverableFormAction,
} from "../actions";

type Update = { id: number; title: string; createdAt: Date };
type Task = { id: number; title: string; status: string };
type Deliverable = { id: number; title: string; approvalStatus: string };

export function SubEntityManager({
    projectId,
    updates,
    tasks,
    deliverables,
}: {
    projectId: number;
    updates: Update[];
    tasks: Task[];
    deliverables: Deliverable[];
}) {
    return (
        <div className="mt-10 space-y-10">
            {/* Updates */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">Timeline updates</h2>
                <ul className="mb-4 space-y-2">
                    {updates.map((u) => (
                        <li key={u.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                            <span>{u.title}</span>
                            <form action={deleteUpdateFormAction}>
                                <input type="hidden" name="id" value={u.id} />
                                <input type="hidden" name="projectId" value={projectId} />
                                <button className="text-red-600" type="submit">Delete</button>
                            </form>
                        </li>
                    ))}
                </ul>
                <form action={addUpdateAction} className="space-y-2">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input name="title" placeholder="Update title" required className="w-full rounded border px-3 py-2 text-sm" />
                    <textarea name="body" placeholder="Update body" required className="w-full rounded border px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-1.5 text-sm text-white" type="submit">Add update</button>
                </form>
            </section>

            {/* Tasks */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">Tasks</h2>
                <ul className="mb-4 space-y-2">
                    {tasks.map((t) => (
                        <li key={t.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                            <span>{t.title}</span>
                            <div className="flex items-center gap-2">
                                <form action={updateTaskAction} className="flex items-center gap-1">
                                    <input type="hidden" name="id" value={t.id} />
                                    <input type="hidden" name="projectId" value={projectId} />
                                    <select name="status" defaultValue={t.status} className="rounded border px-2 py-1">
                                        {["todo", "in_progress", "done"].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <button className="text-brand" type="submit">Save</button>
                                </form>
                                <form action={deleteTaskFormAction}>
                                    <input type="hidden" name="id" value={t.id} />
                                    <input type="hidden" name="projectId" value={projectId} />
                                    <button className="text-red-600" type="submit">Delete</button>
                                </form>
                            </div>
                        </li>
                    ))}
                </ul>
                <form action={addTaskAction} className="flex gap-2">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input name="title" placeholder="Task title" required className="flex-1 rounded border px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-1.5 text-sm text-white" type="submit">Add task</button>
                </form>
            </section>

            {/* Deliverables */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">Deliverables</h2>
                <ul className="mb-4 space-y-2">
                    {deliverables.map((d) => (
                        <li key={d.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                            <span>{d.title} — <em>{d.approvalStatus}</em></span>
                            <form action={deleteDeliverableFormAction}>
                                <input type="hidden" name="id" value={d.id} />
                                <input type="hidden" name="projectId" value={projectId} />
                                <button className="text-red-600" type="submit">Delete</button>
                            </form>
                        </li>
                    ))}
                </ul>
                <form action={addDeliverableAction} className="space-y-2">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input name="title" placeholder="Deliverable title" required className="w-full rounded border px-3 py-2 text-sm" />
                    <input name="fileUrl" placeholder="File URL (optional — from Media library)" className="w-full rounded border px-3 py-2 text-sm" />
                    <input name="previewUrl" placeholder="Live/preview URL (optional)" className="w-full rounded border px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-1.5 text-sm text-white" type="submit">Add deliverable</button>
                </form>
            </section>
        </div>
    );
}
```

- [ ] **Step 3: Create `new/page.tsx`**

```tsx
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm, type ProjectFormValues } from "../_components/ProjectForm";
import { createProjectAction } from "../actions";

export const dynamic = "force-dynamic";

const empty: ProjectFormValues = {
    name: "", description: "", prd: "", clientUserId: "", stage: "planning",
    progress: 0, liveUrl: "", startDate: "", targetDate: "",
};

export default async function NewProjectPage() {
    const clients = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.role, "client"));

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">New project</h1>
            <ProjectForm initial={empty} clients={clients} action={createProjectAction} />
        </div>
    );
}
```

- [ ] **Step 4: Create `[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects, projectUpdates, projectTasks, deliverables, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm, type ProjectFormValues } from "../_components/ProjectForm";
import { SubEntityManager } from "../_components/SubEntityManager";
import { updateProjectAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projectId = Number(id);
    if (!Number.isInteger(projectId)) notFound();

    const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
    if (!project) notFound();

    const [clients, updates, tasks, dels] = await Promise.all([
        db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.role, "client")),
        db.select().from(projectUpdates).where(eq(projectUpdates.projectId, projectId)),
        db.select().from(projectTasks).where(eq(projectTasks.projectId, projectId)),
        db.select().from(deliverables).where(eq(deliverables.projectId, projectId)),
    ]);

    const initial: ProjectFormValues = {
        id: project.id,
        name: project.name,
        description: project.description ?? "",
        prd: project.prd ?? "",
        clientUserId: project.clientUserId,
        stage: project.stage,
        progress: project.progress,
        liveUrl: project.liveUrl ?? "",
        startDate: project.startDate ?? "",
        targetDate: project.targetDate ?? "",
    };

    const boundUpdate = updateProjectAction.bind(null, projectId);

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">Edit project</h1>
            <ProjectForm initial={initial} clients={clients} action={boundUpdate} />
            <SubEntityManager
                projectId={projectId}
                updates={updates}
                tasks={tasks}
                deliverables={dels}
            />
        </div>
    );
}
```

- [ ] **Step 5: Verify build + manual smoke**

Run: `pnpm build`
Expected: build succeeds.
Then `pnpm dev`: as admin, create a project, assign the seeded client, add an update/task/deliverable, edit progress. Confirm they persist on reload.

- [ ] **Step 6: Commit**

```bash
git add "app/(admin)/admin/(protected)/projects/_components" "app/(admin)/admin/(protected)/projects/new" "app/(admin)/admin/(protected)/projects/[id]"
git commit -m "feat: add admin project create/edit form and sub-entity management"
```

---

## Task 8: Portal login & chrome

**Files:**
- Create: `app/(portal)/portal/login/actions.ts`
- Create: `app/(portal)/portal/login/LoginForm.tsx`
- Create: `app/(portal)/portal/login/page.tsx`
- Create: `app/(portal)/portal/layout.tsx`
- Modify: `contexts/LanguageContext.tsx` (add portal keys)

**Interfaces:**
- Consumes: `signIn` from `@blawness/admin-kit/auth`.
- Produces: `clientSignIn(formData)` server action (credentials → `/portal`); portal chrome layout with logout.

- [ ] **Step 1: Add portal keys to `contexts/LanguageContext.tsx`**

Add these keys to BOTH the `id` and `en` dictionaries (use the file's existing key style). English values shown; provide Indonesian equivalents:
```
"portal.login.title" → "Client Login" / "Masuk Klien"
"portal.login.email" → "Email" / "Email"
"portal.login.password" → "Password" / "Kata sandi"
"portal.login.submit" → "Sign in" / "Masuk"
"portal.login.error" → "Invalid email or password" / "Email atau kata sandi salah"
"portal.logout" → "Log out" / "Keluar"
"portal.projects.title" → "Your Projects" / "Project Anda"
"portal.projects.empty" → "No projects yet." / "Belum ada project."
"portal.stage" → "Stage" / "Tahap"
"portal.progress" → "Progress" / "Progres"
"portal.viewLive" → "View Live" / "Lihat Live"
"portal.section.prd" → "Project Brief" / "Ringkasan Project"
"portal.section.updates" → "Updates" / "Update"
"portal.section.tasks" → "Tasks" / "Task"
"portal.section.deliverables" → "Deliverables" / "Deliverable"
"portal.tasksDone" → "done" / "selesai"
"portal.approve" → "Approve" / "Setujui"
"portal.requestRevision" → "Request revision" / "Minta revisi"
"portal.revisionNote" → "What needs to change?" / "Apa yang perlu diubah?"
"portal.status.pending" → "Pending" / "Menunggu"
"portal.status.approved" → "Approved" / "Disetujui"
"portal.status.revision_requested" → "Revision requested" / "Revisi diminta"
```

- [ ] **Step 2: Create `login/actions.ts`**

```ts
"use server";

import { signIn } from "@blawness/admin-kit/auth";
import { redirect } from "next/navigation";

export async function clientSignIn(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    try {
        await signIn("credentials", { email, password, redirect: false });
    } catch {
        redirect("/portal/login?error=1");
    }
    redirect("/portal");
}
```

> Note: admin-kit's credentials provider verifies bcrypt against `users.passwordHash`. A client user (role `client`) authenticates the same way; the portal layout (Task 9) enforces the role.

- [ ] **Step 3: Create `login/LoginForm.tsx`**

```tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { clientSignIn } from "./actions";

export function LoginForm({ hasError }: { hasError: boolean }) {
    const { t } = useLanguage();
    return (
        <form action={clientSignIn} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">{t("portal.login.title")}</h1>
            {hasError && <p className="text-sm text-red-600">{t("portal.login.error")}</p>}
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.login.email")}</span>
                <input name="email" type="email" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.login.password")}</span>
                <input name="password" type="password" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                {t("portal.login.submit")}
            </button>
        </form>
    );
}
```

- [ ] **Step 4: Create `login/page.tsx`**

```tsx
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function PortalLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <LoginForm hasError={error === "1"} />
        </div>
    );
}
```

- [ ] **Step 5: Create `layout.tsx` (portal chrome)**

```tsx
import { signOut } from "@blawness/admin-kit/auth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {children}
        </div>
    );
}

export async function portalSignOut() {
    "use server";
    await signOut({ redirectTo: "/portal/login" });
}
```

> The header (logo, client name, language switch, logout) is rendered by the `(protected)/layout.tsx` in Task 9, since it needs the authenticated client. This root portal layout only sets the base theme so the login page is also on-brand. Keep the `portalSignOut` action in a separate `actions.ts` if colocating a server action with a layout causes a client/server boundary error — move it to `app/(portal)/portal/(protected)/actions.ts`.

- [ ] **Step 6: Verify build + manual smoke**

Run: `pnpm build` → succeeds.
`pnpm dev`: visit `/portal/login` — the branded form renders on the slate background. Submitting wrong credentials returns to `/portal/login?error=1` with the error message.

- [ ] **Step 7: Commit**

```bash
git add "app/(portal)/portal/login" "app/(portal)/portal/layout.tsx" contexts/LanguageContext.tsx
git commit -m "feat: add client portal login and base chrome"
```

---

## Task 9: Portal — protected layout & project list (with e2e)

**Files:**
- Create: `app/(portal)/portal/(protected)/actions.ts` (portalSignOut)
- Create: `app/(portal)/portal/(protected)/layout.tsx`
- Create: `app/(portal)/portal/(protected)/page.tsx`
- Create: `e2e/portal.spec.ts`

**Interfaces:**
- Consumes: `requireClient` (Task 3), `getClientProjects` (Task 4), `signOut`.
- Produces: authenticated portal shell + project list; auto-redirect to detail when exactly one project.

- [ ] **Step 1: Write the failing e2e test**

Create `e2e/portal.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

// Assumes `pnpm seed:client` has run: client@example.com / client-password-123
// owns project slug "seed-project-001".
const EMAIL = "client@example.com";
const PASSWORD = "client-password-123";

async function login(page) {
    await page.goto("/portal/login");
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/portal(\/.*)?$/);
}

test("unauthenticated portal access redirects to login", async ({ page }) => {
    await page.goto("/portal");
    await expect(page).toHaveURL(/\/portal\/login/);
});

test("client logs in and sees their project", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Sample Website Project")).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test:e2e -- e2e/portal.spec.ts`
Expected: FAIL — `/portal` routes don't exist yet (404 / no redirect).

- [ ] **Step 3: Create `(protected)/actions.ts`**

```ts
"use server";

import { signOut } from "@blawness/admin-kit/auth";

export async function portalSignOut() {
    await signOut({ redirectTo: "/portal/login" });
}
```

- [ ] **Step 4: Create `(protected)/layout.tsx`**

```tsx
import { requireClient } from "@/lib/portal-auth";
import { PortalHeader } from "./PortalHeader";

export const dynamic = "force-dynamic";

export default async function PortalProtectedLayout({ children }: { children: React.ReactNode }) {
    const client = await requireClient();
    return (
        <div className="mx-auto min-h-screen max-w-4xl px-4 py-6">
            <PortalHeader clientName={client.name || client.email} />
            <main className="mt-6">{children}</main>
        </div>
    );
}
```

Also create `app/(portal)/portal/(protected)/PortalHeader.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { portalSignOut } from "./actions";

export function PortalHeader({ clientName }: { clientName: string }) {
    const { t, language, setLanguage } = useLanguage();
    return (
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
                <Image src="/favicon.svg" alt="Vorca Studio" width={28} height={28} />
                <span className="font-semibold">Vorca Studio</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">{clientName}</span>
                <button
                    onClick={() => setLanguage(language === "id" ? "en" : "id")}
                    className="rounded border border-slate-300 px-2 py-1"
                >
                    {language.toUpperCase()}
                </button>
                <form action={portalSignOut}>
                    <button type="submit" className="text-slate-600 hover:underline">{t("portal.logout")}</button>
                </form>
            </div>
        </header>
    );
}
```

> Verify `useLanguage()` exposes `language` and `setLanguage` (or the equivalent setter). If the context uses a different setter name (e.g. `toggleLanguage`), use that instead — check `contexts/LanguageContext.tsx`.

- [ ] **Step 5: Create `(protected)/page.tsx`**

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireClient } from "@/lib/portal-auth";
import { getClientProjects } from "@/lib/projects";
import { ProjectListClient } from "./ProjectListClient";

export const dynamic = "force-dynamic";

export default async function PortalHomePage() {
    const { userId } = await requireClient();
    const projects = await getClientProjects(userId);

    if (projects.length === 1) redirect(`/portal/${projects[0].slug}`);

    return <ProjectListClient projects={projects} />;
}
```

Create `app/(portal)/portal/(protected)/ProjectListClient.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ClientProjectSummary } from "@/lib/projects";

export function ProjectListClient({ projects }: { projects: ClientProjectSummary[] }) {
    const { t } = useLanguage();
    return (
        <div>
            <h1 className="mb-4 text-2xl font-semibold">{t("portal.projects.title")}</h1>
            {projects.length === 0 && <p className="text-slate-500">{t("portal.projects.empty")}</p>}
            <ul className="grid gap-4 sm:grid-cols-2">
                {projects.map((p) => (
                    <li key={p.id}>
                        <Link href={`/portal/${p.slug}`} className="block rounded-xl bg-white p-5 shadow-sm hover:shadow">
                            <h2 className="font-semibold">{p.name}</h2>
                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{p.stage}</p>
                            <div className="mt-3 h-2 w-full rounded bg-slate-100">
                                <div className="h-2 rounded bg-slate-900" style={{ width: `${p.progress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{p.progress}%</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

- [ ] **Step 6: Run the e2e test to verify it passes**

Run: `pnpm test:e2e -- e2e/portal.spec.ts`
Expected: both tests PASS (redirect test + login-and-see-project). If the single-project auto-redirect sends the client straight to `/portal/seed-project-001`, the "sees their project" assertion still passes only once the detail page (Task 10) renders the name. **If Task 10 is not yet implemented, temporarily seed a second project OR assert the URL is `/portal/seed-project-001`.** To keep this task independently green, change the assertion to:
```ts
await expect(page).toHaveURL(/\/portal\/seed-project-001/);
```
and restore the visible-name assertion in Task 10.

- [ ] **Step 7: Commit**

```bash
git add "app/(portal)/portal/(protected)" e2e/portal.spec.ts
git commit -m "feat: add authenticated portal shell and project list with e2e"
```

---

## Task 10: Portal — project dashboard & deliverable approval (with e2e)

**Files:**
- Create: `app/(portal)/portal/(protected)/[slug]/page.tsx`
- Create: `app/(portal)/portal/(protected)/[slug]/DeliverableActions.tsx`
- Create: `app/(portal)/portal/(protected)/[slug]/actions.ts`
- Modify: `e2e/portal.spec.ts` (add ownership-gate + approval tests)

**Interfaces:**
- Consumes: `requireClient`, `getClientProject`, `getDeliverableOwner`, `buildArticleHtml`/`extractHeadingsFromHtml` from `lib/article-html.ts`.
- Produces: `approveDeliverable(formData)` and `requestRevision(formData)` server actions — both `requireClient()` + ownership re-check via `getDeliverableOwner`.

- [ ] **Step 1: Add failing e2e tests**

Append to `e2e/portal.spec.ts`:

```ts
test("client sees project dashboard sections", async ({ page }) => {
    await login(page);
    await page.goto("/portal/seed-project-001");
    await expect(page.getByText("Sample Website Project")).toBeVisible();
    await expect(page.getByText("Homepage design")).toBeVisible(); // a deliverable
});

test("ownership gate: bogus slug is not found", async ({ page }) => {
    await login(page);
    const res = await page.goto("/portal/does-not-exist-000");
    expect(res?.status()).toBe(404);
});

test("client approves a deliverable", async ({ page }) => {
    await login(page);
    await page.goto("/portal/seed-project-001");
    await page.getByRole("button", { name: /Approve|Setujui/ }).first().click();
    await expect(page.getByText(/Approved|Disetujui/).first()).toBeVisible();
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `pnpm test:e2e -- e2e/portal.spec.ts`
Expected: the three new tests FAIL (detail route 404 / buttons absent).

- [ ] **Step 3: Create `[slug]/actions.ts`**

```ts
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
```

- [ ] **Step 4: Create `[slug]/DeliverableActions.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { approveDeliverable, requestRevision } from "./actions";
import type { ClientDeliverable } from "@/lib/projects";

export function DeliverableActions({ deliverable, slug }: { deliverable: ClientDeliverable; slug: string }) {
    const { t } = useLanguage();
    const [pending, startTransition] = useTransition();
    const [showRevision, setShowRevision] = useState(false);
    const [note, setNote] = useState("");

    if (deliverable.approvalStatus !== "pending") return null;

    return (
        <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
                disabled={pending}
                onClick={() =>
                    startTransition(() => {
                        const fd = new FormData();
                        fd.set("deliverableId", String(deliverable.id));
                        fd.set("slug", slug);
                        approveDeliverable(fd);
                    })
                }
                className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
                {t("portal.approve")}
            </button>

            {!showRevision ? (
                <button
                    disabled={pending}
                    onClick={() => setShowRevision(true)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm"
                >
                    {t("portal.requestRevision")}
                </button>
            ) : (
                <div className="flex w-full flex-col gap-2 sm:flex-row">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t("portal.revisionNote")}
                        className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <button
                        disabled={pending || !note.trim()}
                        onClick={() =>
                            startTransition(() => {
                                const fd = new FormData();
                                fd.set("deliverableId", String(deliverable.id));
                                fd.set("slug", slug);
                                fd.set("note", note);
                                requestRevision(fd);
                            })
                        }
                        className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {t("portal.requestRevision")}
                    </button>
                </div>
            )}
        </div>
    );
}
```

- [ ] **Step 5: Create `[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/portal-auth";
import { getClientProject } from "@/lib/projects";
import { buildArticleHtml } from "@/lib/article-html";
import { DeliverableActions } from "./DeliverableActions";
import { ProjectDashboardChrome } from "./ProjectDashboardChrome";

export const dynamic = "force-dynamic";

export default async function PortalProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { userId } = await requireClient();
    const project = await getClientProject(userId, slug);
    if (!project) notFound();

    const prdHtml = project.prd ? buildArticleHtml(project.prd) : null;

    return (
        <ProjectDashboardChrome project={project} prdHtml={prdHtml}>
            {(deliverable) => <DeliverableActions deliverable={deliverable} slug={slug} />}
        </ProjectDashboardChrome>
    );
}
```

Create `app/(portal)/portal/(protected)/[slug]/ProjectDashboardChrome.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ClientProjectDetail, ClientDeliverable } from "@/lib/projects";

const STATUS_KEY: Record<string, string> = {
    pending: "portal.status.pending",
    approved: "portal.status.approved",
    revision_requested: "portal.status.revision_requested",
};

export function ProjectDashboardChrome({
    project,
    prdHtml,
    children,
}: {
    project: ClientProjectDetail;
    prdHtml: string | null;
    children: (d: ClientDeliverable) => ReactNode;
}) {
    const { t } = useLanguage();
    const doneCount = project.tasks.filter((x) => x.status === "done").length;

    return (
        <div className="space-y-10">
            {/* Header */}
            <section className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">{project.name}</h1>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide">{project.stage}</span>
                </div>
                <div className="mt-4 h-3 w-full rounded bg-slate-100">
                    <div className="h-3 rounded bg-slate-900" style={{ width: `${project.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{project.progress}%</p>
                {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white">
                        {t("portal.viewLive")}
                    </a>
                )}
            </section>

            {/* PRD */}
            {prdHtml && (
                <section className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold">{t("portal.section.prd")}</h2>
                    <div className="article-prose max-w-none" dangerouslySetInnerHTML={{ __html: prdHtml }} />
                </section>
            )}

            {/* Updates */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">{t("portal.section.updates")}</h2>
                <ol className="space-y-3">
                    {project.updates.map((u) => (
                        <li key={u.id} className="rounded-xl bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{u.title}</h3>
                                <time className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</time>
                            </div>
                            <div className="mt-1 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: u.body }} />
                        </li>
                    ))}
                </ol>
            </section>

            {/* Tasks */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">
                    {t("portal.section.tasks")}{" "}
                    <span className="text-sm font-normal text-slate-500">
                        {doneCount}/{project.tasks.length} {t("portal.tasksDone")}
                    </span>
                </h2>
                <ul className="space-y-2">
                    {project.tasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm shadow-sm">
                            <span className={task.status === "done" ? "text-green-600" : "text-slate-300"}>✓</span>
                            <span className={task.status === "done" ? "line-through text-slate-400" : ""}>{task.title}</span>
                            <span className="ml-auto text-xs uppercase text-slate-400">{task.status}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Deliverables */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">{t("portal.section.deliverables")}</h2>
                <ul className="space-y-3">
                    {project.deliverables.map((d) => (
                        <li key={d.id} className="rounded-xl bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{d.title}</h3>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{t(STATUS_KEY[d.approvalStatus])}</span>
                            </div>
                            <div className="mt-1 flex gap-4 text-sm">
                                {d.fileUrl && <a className="text-brand hover:underline" href={d.fileUrl} target="_blank" rel="noreferrer">File</a>}
                                {d.previewUrl && <a className="text-brand hover:underline" href={d.previewUrl} target="_blank" rel="noreferrer">Preview</a>}
                            </div>
                            {children(d)}
                            {d.events.length > 0 && (
                                <ul className="mt-3 space-y-1 border-t border-slate-100 pt-2 text-xs text-slate-500">
                                    {d.events.map((e) => (
                                        <li key={e.id}>
                                            {t(STATUS_KEY[e.action === "approved" ? "approved" : "revision_requested"])}
                                            {" · "}
                                            {new Date(e.createdAt).toLocaleDateString()}
                                            {e.note ? ` — "${e.note}"` : ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
```

> `STATUS_KEY` maps `approved`/`revision_requested` to the `portal.status.*` keys; the event line reuses those.

- [ ] **Step 6: Restore the Task 9 name assertion**

If you changed the Task 9 test to assert the URL, change it back to `await expect(page.getByText("Sample Website Project")).toBeVisible();` now that the detail page renders.

- [ ] **Step 7: Run the e2e tests to verify they pass**

Run: `pnpm test:e2e -- e2e/portal.spec.ts`
Expected: all tests PASS — dashboard sections visible, bogus slug 404, approve flips status to Approved and shows history.

- [ ] **Step 8: Commit**

```bash
git add "app/(portal)/portal/(protected)/[slug]" e2e/portal.spec.ts
git commit -m "feat: add portal project dashboard and deliverable approval flow"
```

---

## Task 11: Cross-client ownership isolation e2e

**Files:**
- Modify: `scripts/seed-client.ts` (seed a SECOND client for the isolation test) OR add a dedicated seed
- Modify: `e2e/portal.spec.ts`

**Interfaces:**
- Consumes: seeded second client with no access to `seed-project-001`.

- [ ] **Step 1: Extend the seed to create a second client**

At the end of `scripts/seed-client.ts` (before `process.exit(0)`), add a second isolated client with their own project so the test has two distinct owners:

```ts
const OTHER_EMAIL = "client2@example.com";
const otherHash = await bcrypt.hash("client-password-456", 12);
let [other] = await db.select({ id: users.id }).from(users).where(eq(users.email, OTHER_EMAIL)).limit(1);
if (other) {
    await db.update(users).set({ passwordHash: otherHash, role: "client" }).where(eq(users.id, other.id));
} else {
    [other] = await db.insert(users).values({ email: OTHER_EMAIL, name: "Second Client", passwordHash: otherHash, role: "client" }).returning({ id: users.id });
}
const otherHas = await db.select({ id: projects.id }).from(projects).where(eq(projects.clientUserId, other.id)).limit(1);
if (otherHas.length === 0) {
    await db.insert(projects).values({
        slug: "seed-project-002",
        name: "Second Client Project",
        clientUserId: other.id,
        stage: "planning",
        progress: 5,
    });
}
console.log("Second client client2@example.com + slug: seed-project-002 ready");
```

- [ ] **Step 2: Re-run the seed**

Run: `pnpm seed:client`
Expected: prints both the first and second client readiness lines.

- [ ] **Step 3: Write the failing isolation test**

Append to `e2e/portal.spec.ts`:

```ts
test("client A cannot view client B's project", async ({ page }) => {
    // Log in as the FIRST client, then try to open the SECOND client's project.
    await login(page); // client@example.com
    const res = await page.goto("/portal/seed-project-002");
    expect(res?.status()).toBe(404); // ownership filter → getClientProject returns null → notFound()
});
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test:e2e -- e2e/portal.spec.ts -g "cannot view"`
Expected: PASS — the ownership filter in `getClientProject` returns null for a non-owned slug, so the page calls `notFound()` (404). This is the most important security test.

- [ ] **Step 5: Run the full portal suite**

Run: `pnpm test:e2e -- e2e/portal.spec.ts`
Expected: all portal tests PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-client.ts e2e/portal.spec.ts
git commit -m "test: add cross-client ownership isolation e2e"
```

---

## Task 12: Final verification & docs

**Files:**
- Modify: `README.md` (document `seed:client` + portal) — optional but recommended
- Modify: `CLAUDE.md` (note the portal surface) — optional

- [ ] **Step 1: Full lint + build**

Run: `pnpm lint && pnpm build`
Expected: both pass with no errors.

- [ ] **Step 2: Full e2e run**

Run: `pnpm test:e2e`
Expected: existing suites + `portal.spec.ts` pass. (Ensure `pnpm seed:client` has run against the test DB first.)

- [ ] **Step 3: Manual end-to-end smoke**

`pnpm dev`, then:
1. As admin: create a client via Users screen (role `client`), create a project, assign the client, add PRD/update/task/deliverable.
2. As that client at `/portal/login`: see the project, view PRD/updates/tasks, approve the deliverable, request a revision on another — confirm status + history update.

- [ ] **Step 4: Document (optional)**

Add a short "Client Portal" section to `README.md`: env unchanged; create clients via Users screen with role `client`; `pnpm seed:client` for a demo; portal lives at `/portal`.

- [ ] **Step 5: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document client project portal"
```

---

## Self-Review Notes

- **Spec coverage:** Data model → Task 1. RBAC/client role → Task 2. requireClient → Task 3. Ownership-filtered reads → Task 4. Admin management (list/form/actions/nav) → Tasks 6–7. Portal login/chrome → Task 8. Portal list → Task 9. Dashboard + approve/revise + history → Task 10. Ownership isolation test → Task 11. Seed → Task 5. Testing (login, ownership gate, approve, revise, redirect) → Tasks 9–11. Migration/seed → Tasks 1, 5.
- **Non-guessable slug** → Task 1 (`lib/project-slug.ts`). **No `unstable_cache` / `force-dynamic`** → applied on every portal route. **Sanitize on save & render** → actions use `sanitizeHtml`; dashboard uses `buildArticleHtml`.
- **Type consistency:** `getClientProject`/`getClientProjects`/`getDeliverableOwner` signatures in Task 4 match their consumers in Tasks 9–10; `ClientProjectSummary`/`ClientProjectDetail`/`ClientDeliverable` types are imported where used. Integer ids throughout.
- **Known verification-order caveat:** Task 9's "sees project" test depends on Task 10's detail page because a single project auto-redirects; the task documents the temporary URL-assertion workaround and Task 10 Step 6 restores it.
