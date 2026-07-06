# Client Project Portal — Design Spec

**Date:** 2026-07-06
**Status:** Approved (pending spec review)
**Author:** Vorca Studio

## Problem

Vorca's clients have no way to see the state of the projects they've commissioned. Progress
lives in staff heads and chat threads. Clients ask "how's it going?" and staff answer manually.

We want a **client-facing portal** where each client logs in and monitors their own project(s):
what stage it's at, recent updates, task progress, the project brief/PRD, and the deliverables —
including approving deliverables or requesting revisions.

## Goals

- A logged-in client can see **only their own** project(s) and everything about them.
- Data is **up-to-date on load** (fresh every page view). No realtime push infra required —
  project updates happen on the order of hours/days, not seconds.
- Clients can **approve** a deliverable or **request a revision** (with a note); history is kept.
- Vorca staff manage everything from the **existing admin CMS** (no new admin tool).
- Reuse admin-kit auth/RBAC — no separate auth system.

## Non-Goals (v1)

- Realtime push (WebSocket/SSE). "Fresh on load" is sufficient.
- Client comments/threads on updates (only deliverable approve/revise interaction).
- PRD versioning / revision history (single editable rich-text field).
- Client self-signup, password reset UI, or billing/invoices.
- Multiple clients per project or org/team accounts (one client user owns a project).

## Approach

**Opsi A (chosen): reuse admin-kit auth + a new `client` RBAC role.** Clients live in the same
`users` table with role `client` and no admin permissions. The portal is its own route group
(`app/(portal)/portal/`) with its own login, layout, and theme. Project/PRD/update/task/deliverable
management is a **custom admin screen** in the existing CMS (same pattern as `articles`).

Rejected — **Opsi B: separate client auth system** (own `clients` table, separate NextAuth cookie).
Full isolation, but large duplication (login, sessions, password reset, security surface). Overkill
for current needs.

---

## 1. Data Model

New app-local tables in `db/schema.ts` alongside `articles`. All child tables FK to `projects`
with cascade delete. Migration via `pnpm db:generate` + `pnpm db:migrate` (same as `articles`).

> **User/PK id type:** admin-kit `users.id` is a **`serial` (integer)**, and `requireUserId()`
> returns a `number`. All FKs to `users.id` are `integer`; all new PKs are `serial`. (An earlier
> draft said uuid — corrected here.)

### `projects`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | integer |
| `slug` | text unique | **non-guessable** short id (nanoid), used in portal URL |
| `name` | text | |
| `description` | text nullable | short summary |
| `prd` | text nullable | sanitized HTML, authored via Tiptap; rendered read-only in portal |
| `clientUserId` | integer FK → `users.id` | owning client |
| `stage` | enum | `planning` · `design` · `development` · `review` · `completed` |
| `progress` | int | 0–100 |
| `liveUrl` | text nullable | Vercel/live preview link |
| `startDate` | date nullable | |
| `targetDate` | date nullable | |
| `createdAt` / `updatedAt` | timestamptz | |

### `projectUpdates` (timeline)
`id` · `projectId` FK · `title` · `body` (sanitized HTML/text) · `authorId` FK → `users.id` · `createdAt`

### `projectTasks` (checklist)
`id` · `projectId` FK · `title` · `status` enum (`todo` · `in_progress` · `done`) · `sortOrder` int · `createdAt`

### `deliverables`
`id` · `projectId` FK · `title` · `fileUrl` text nullable (R2) · `previewUrl` text nullable (live link) ·
`approvalStatus` enum (`pending` · `approved` · `revision_requested`) default `pending` · `createdAt`

### `deliverableEvents` (approve/revise history)
`id` · `deliverableId` FK · `action` enum (`approved` · `revision_requested`) · `note` text nullable ·
`actorUserId` FK → `users.id` · `createdAt`

---

## 2. Auth, RBAC & Portal Routes

### RBAC (`rbac.ts`)
- New role **`client`** with **no admin permissions** (cannot touch any CMS screen).
- New staff permissions: `projects.read` · `projects.create` · `projects.update` · `projects.delete`.
- `admin` already holds `*`. Grant the `projects.*` permissions to `editor` too (all Vorca staff are
  trusted). Easy to narrow later.
- `fallbackRole` stays `editor`.

### Client login
Reuse admin-kit NextAuth (same credentials provider + password hashing). A dedicated, Vorca-branded
login page at `/portal/login` renders a light form that calls
`signIn("credentials", { redirectTo: "/portal" })`. Admin login is untouched.

### Gating (two layers — strict)
1. **`requireClient()`** helper (new, e.g. `lib/portal-auth.ts`) used by the portal `(protected)`
   layout: calls admin-kit `auth()` directly; if unauthenticated → `redirect("/portal/login")`;
   if `role !== "client"` → reject. (Does **not** use admin-kit `requireUser()`, which redirects to
   the admin login.)
2. **Ownership check** in every query and every server action: `project.clientUserId === session.user.id`.
   Client A can never see or approve Client B's project — re-validated server-side on approve/revise.

`proxy.ts` stays as-is (`/admin/:path*` only). The portal is guarded in its layout, which avoids
fighting admin-kit's built-in redirect target.

### Client account creation
Staff create a client user via the admin-kit Users screen (pick role `client`, set a password), then
assign them to a project via the project form (dropdown of `client`-role users).

### Portal routes
```
app/(portal)/portal/
  layout.tsx              # portal chrome (own theme, Vorca logo, language switch, logout)
  login/page.tsx          # client login form
  (protected)/
    layout.tsx            # requireClient()
    page.tsx              # list client's projects (auto-redirect to detail if only 1)
    [slug]/page.tsx       # project dashboard
    [slug]/actions.ts     # approveDeliverable / requestRevision (ownership-checked)
```

---

## 3. Admin Management Surface

Custom screen under `app/(admin)/admin/(protected)/projects/` (same pattern as `articles`):
```
projects/
  page.tsx                     # list all projects (name, client, stage, progress)
  new/page.tsx                 # create form
  [id]/page.tsx                # edit project + manage its contents
  _components/ProjectForm.tsx  # main form (client component)
  actions.ts                   # server actions, gated by requirePermission("projects.*")
```

**`ProjectForm.tsx` manages:**
- Base fields: name, slug, description, `stage`, `progress` (0–100 slider), `liveUrl`, dates
- **Assign client**: dropdown of `client`-role users
- **PRD**: Tiptap `Editor` → `sanitizeHtml` on save
- **Updates**: add/delete timeline entries (title + body)
- **Tasks**: add/edit/delete + set status + reorder via `sortOrder`
- **Deliverables**: add (upload file to R2 via `uploadFile`, or set `previewUrl` live link) + view
  client approval status & event history (read-only for staff)

**Server actions (`actions.ts`)** — all `requirePermission("projects.<action>")` + sanitize where HTML:
`createProject` / `updateProject` / `deleteProject`, `addUpdate` / `deleteUpdate`,
`addTask` / `updateTask` / `deleteTask`, `addDeliverable` / `deleteDeliverable`.
After mutation: `revalidatePath` the relevant admin route. The portal is **not** cached (see §5).

**Admin nav**: add "Projects" to `navItems` (icon via `nav-icons.ts`, e.g. `FolderKanban`),
`requires: "projects.read"`.

---

## 4. Client Portal UX & Approval Flow

**`/portal` (project list)** — a card per owned project: name, `stage` badge, progress bar, target
date. If only one project → auto-redirect to its detail.

**`/portal/[slug]` (project dashboard)** — single page, top to bottom:
1. **Header**: project name, `stage` badge, large progress bar, **"View Live"** button (if `liveUrl`).
2. **PRD / Brief**: read-only HTML render (via `lib/article-html.ts`) + compact TOC — scope reference.
3. **Timeline updates**: `projectUpdates` newest-first (date + title + body).
4. **Tasks**: read-only checklist grouped by status + "x of y done" summary.
5. **Deliverables**: a card per deliverable — title, file/preview link or `previewUrl`, **status badge**
   (`pending`/`approved`/`revision_requested`), and event history.

**Approve / revise flow** (the only client write action):
- `pending` deliverable shows two buttons: **Approve** and **Request revision**.
- **Approve** → light confirm → `approveDeliverable(id)`: check ownership, set `approvalStatus="approved"`,
  insert `deliverableEvents` row (`approved`, actor, time).
- **Request revision** → modal with a **required** note → `requestRevision(id, note)`: check ownership,
  set `revision_requested`, insert event with `note`.
- History shows under each deliverable ("Approved 6 Jul" / "Revision requested: '…'"). When staff upload
  a revision / set status back to `pending`, the buttons reappear.
- Actions use `useTransition` + revalidate → status refreshes immediately (matches "fresh on load",
  no realtime infra).

**Portal chrome**: slim header (Vorca logo, client name, id/en language switch, logout), clean dashboard
theme distinct from the black marketing site and the admin CMS. All UI labels via `LanguageContext`;
staff-authored content (PRD, updates) is free-text.

---

## 5. Data Layer, Caching, Security & Testing

### Data layer (`lib/projects.ts`) — differs from `lib/articles.ts`
- **No `unstable_cache`.** `articles` is cached because it's public and identical for everyone. Portal
  data is per-client and sensitive → query the DB directly in server components with
  `export const dynamic = "force-dynamic"` on portal routes. "Fresh on load" is the requirement, and it
  avoids any cross-client leak via a shared cache.
- Read functions always **take a `userId`** and filter `clientUserId = userId` **at the query level**
  (not post-filtering). E.g. `getClientProjects(userId)`, `getClientProject(userId, slug)`,
  `getDeliverableForClient(userId, deliverableId)`.

### Security checklist
- Ownership validated on **every** read and write, server-side (not just in the UI).
- Project `slug` is **non-guessable** (short nanoid) — defense-in-depth above auth.
- Approve/revise server actions: `requireClient()` + re-fetch the deliverable with an ownership filter
  before mutating; reject if it isn't theirs.
- Role `client` has no admin permissions → even if they open `/admin`, screens reject them.
- Sanitize PRD & updates (HTML) on save **and** on render.

### Testing (Playwright, `e2e/portal.spec.ts`)
- Client logs in → sees only their own project(s).
- **Ownership gate**: Client A accessing Client B's project slug → rejected (most important test).
- Approve a deliverable → status becomes `approved` + history entry appears.
- Request revision (with note) → status becomes `revision_requested`.
- Redirect when unauthenticated / role isn't `client`.
- Seed helper to create a client + project in the DB for tests.

### Migration & seed
- `pnpm db:generate` + `pnpm db:migrate` for the new tables.
- Optional `seed:client` script (like `seed:admin`) to create a sample client account in dev.
