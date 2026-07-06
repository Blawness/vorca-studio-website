# Client Self-Registration with Admin Approval — Design Spec

**Date:** 2026-07-06
**Status:** Approved (pending spec review)
**Author:** Vorca Studio
**Builds on:** [Client Project Portal](2026-07-06-client-project-portal-design.md)

## Problem

Today, client portal accounts are created only by staff (admin creates a `users` row with role
`client` via the Users screen). Prospective clients have no way to request access themselves — a
staff member must do everything manually before a client can even log in.

We want prospective clients to **self-register** from the public site, while keeping staff in
control: a registration is a **request** that an admin must **approve** before an account exists.

## Goals

- A visitor can submit a registration request at `/portal/register` (name, email, password,
  company, phone, note).
- The request does **not** create a login account. Staff review it and **approve** or **reject**.
- On approval, a `users` row with role `client` is created (using the password chosen at
  registration), so the client can immediately log in at `/portal/login`.
- Email notifications: admin is notified of new requests; the client is notified on approve/reject
  (in the language they registered in).
- Reuse the existing auth system — no second auth system, no change to how login works.

## Non-Goals (v1)

- Set-password links / magic links / password reset (password is set at registration).
- Serious rate limiting (honeypot + strict validation only; the existing contact form has none
  either).
- Auto-creating or auto-assigning a project on approval (approval creates the account only; project
  assignment stays in the existing `/admin/projects` flow).
- Editing a pending request's details by staff before approval (approve or reject as submitted).

## Approach

**A separate `clientSignupRequests` table holds pending requests; the `users` account is created
by admin on approval.** Registrant data never enters the `users` table until approved. The password
is hashed (bcrypt) at registration time and stored on the request row; on approval it is copied into
the new `users` row and then nulled on the request.

Rejected — **set-password-link on approval** (register without a password; email a token link to set
one). Safer against storing a hash in two places, but needs a token table, a set-password page, and
an extra email flow — overkill for v1. We instead null the request's `passwordHash` immediately after
approval so the hash lives in only one place going forward.

**Single auth system.** Staff and clients share admin-kit's NextAuth and the `users` table; they
differ only by `role` and by which login page they use. This feature adds a public *request* surface
and an admin *review* surface — it does not add a second auth system.

---

## 1. Data Model

New app-local table in `db/schema.ts` (alongside `projects`):

### `clientSignupRequests`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | integer |
| `name` | text notNull | |
| `email` | text notNull unique | login email once approved |
| `passwordHash` | text nullable | bcrypt; set at registration, **nulled after approval** |
| `company` | text nullable | |
| `phone` | text nullable | |
| `note` | text nullable | free-text needs/description |
| `locale` | text notNull default `'id'` | `'id'` or `'en'` — language the client registered in; drives approve/reject email language |
| `status` | enum `signup_request_status` | `pending` · `approved` · `rejected`, default `pending` |
| `reviewNote` | text nullable | admin's reject reason / note |
| `reviewedByUserId` | integer FK → `users.id` (set null) | who reviewed |
| `reviewedAt` | timestamptz nullable | |
| `createdAt` | timestamptz notNull default now | |

Notes:
- `email` UNIQUE prevents two pending requests for the same email at the DB level. A previously
  `rejected` request must not block re-registration — handled in the action by deleting/replacing a
  prior `rejected` row for that email (see §2), since the column is unique.
- Migration via `pnpm db:generate` + `pnpm db:migrate`.

---

## 2. Registration Flow (public)

**Page `app/(portal)/portal/register/`** — public, same slate/light theme as `/portal/login`:
- `page.tsx` (host, reads `searchParams` for `success`/`error` → dynamic under `cacheComponents`),
  `RegisterForm.tsx` (`"use client"`, uses `useLanguage().t`).
- Fields: name, email, password, **confirm password**, company, phone, note, plus a **honeypot**
  hidden field.
- `/portal/login` gets a "Register" link; the register page links back to login.

**Server action `submitSignupRequest(formData)`** (in `app/(portal)/portal/register/actions.ts`):
1. If the honeypot field is non-empty → silently succeed (drop the bot) with the success redirect.
2. Zod validation: name required; valid email; password ≥ 8 chars; password === confirm; `locale`
   in (`id`,`en`). Invalid → `redirect("/portal/register?error=validation")`.
3. **Duplicate check:** if the email already exists in `users`, OR a `pending` request exists for it
   → redirect to a generic result `/portal/register?error=exists` rendering "This email is already
   registered or is being processed." (No row created; does not reveal which case it is.)
4. If a prior `rejected` request exists for the email, delete it (the unique column would otherwise
   block re-registration).
5. Hash the password (bcrypt, cost 12), insert a `clientSignupRequests` row (`status: "pending"`,
   `locale`).
6. Send the **admin notification email** (best-effort; failure does not fail the request).
7. `redirect("/portal/register?success=1")` → the page renders "Registration submitted; awaiting
   admin approval."

`locale` is submitted from the form via a hidden input bound to the current `useLanguage().language`.

---

## 3. Admin Review Surface

**Screen `app/(admin)/admin/(protected)/client-requests/`** (custom pattern like `projects`):
```
client-requests/
  page.tsx        # list requests (default: pending first) — name, email, company, date, status
  [id]/page.tsx   # one request's detail + Approve / Reject controls
  actions.ts      # server actions, gated by requirePermission("clientRequests.review")
```

**RBAC (`rbac.ts`):** new permission `clientRequests.review`, granted to `admin` (via `*`) and
`editor` (added to the editor role's list next to the `projects.*` permissions).

**Admin nav:** add "Client Requests" to `navItems` (icon `UserPlus` via `nav-icons.ts`),
`requires: "clientRequests.review"`. A pending-count badge is optional (only if trivial).

**Server actions (`actions.ts`), all `requirePermission("clientRequests.review")`:**
- `approveRequestFormAction(formData)` — reads `id`; runs in a DB transaction:
  1. Load the request; if not `pending` → return (idempotent; blocks double-approve / races).
  2. If a `users` row already exists for the email (a staff member created it manually) → mark the
     request `approved` (record reviewer/time) **without** creating a duplicate user; skip user
     insert.
  3. Otherwise insert `users` (`role: "client"`, `name`, `passwordHash` from the request).
  4. Update the request: `status="approved"`, `reviewedByUserId`, `reviewedAt`, and **null
     `passwordHash`**.
  5. After commit, send the **client "approved" email** (best-effort), in the request's `locale`.
  6. `revalidatePath("/admin/client-requests")`, redirect back with a success param.
- `rejectRequestFormAction(formData)` — reads `id` + optional `reviewNote`:
  1. Guard `status === "pending"`.
  2. Set `status="rejected"`, `reviewNote`, `reviewedByUserId`, `reviewedAt`.
  3. Send the **client "rejected" email** (best-effort, `locale`), including the reason if present.
  4. Revalidate + redirect.

Approval creates the client account **only**; assigning a project stays in the existing
`/admin/projects` form.

---

## 4. Email Helper, Templates & i18n

**`lib/email.ts`** — extract the existing `fetch`-to-Resend pattern (currently inline in
`app/api/contact/route.ts`) into a reusable helper:
```ts
export async function sendEmail(opts: { to: string | string[]; subject: string; html: string }): Promise<void>
```
- Reads `RESEND_API_KEY`; if absent → `console.warn` + return (no-op), same as today.
- `from: "noreply@vorcastudio.com"`. Callers wrap in try/catch so email failure never fails the
  primary action. `app/api/contact/route.ts` is refactored to use this helper (small, keeps behavior).

**Three templates** (small functions returning `{ subject, html }`):
1. **Admin — new request:** registrant details (name, email, company, phone, note) + a link to
   `/admin/client-requests/[id]`. Sent to `process.env.ADMIN_NOTIFY_EMAIL ?? "marketing@vorcastudio.com"`.
   Single language (Indonesian; internal).
2. **Client — approved:** welcome + prompt to log in at `/portal/login`. Language = request `locale`.
3. **Client — rejected:** polite notice + reason (if `reviewNote` set). Language = request `locale`.

**i18n:**
- Admin email: Indonesian only.
- Client emails: rendered in the request's `locale` (`id`/`en`).
- Register form + success/error copy + admin screen labels: new keys in `contexts/LanguageContext.tsx`,
  added to **both** `id` and `en` maps (same pattern as the `portal.*` keys).

---

## 5. Security, Edge Cases & Testing

### Security
- `/portal/register` + `submitSignupRequest` are public: strict zod validation + a honeypot field;
  password hashed with bcrypt (cost 12), never stored/logged in plaintext; confirm-password checked
  server-side.
- **Email enumeration:** the duplicate message is generic ("already registered or being processed"),
  not revealing which state the email is in.
- Admin approve/reject: `requirePermission("clientRequests.review")` + `pending`-status guard
  (idempotent; prevents double-approve and TOCTOU races).
- Approve creates the `users` row and updates the request in **one transaction**; if the user insert
  fails (e.g. email taken concurrently) the transaction rolls back and the request stays `pending`.
- Approved account role is `client` → subject to all existing portal/admin gating (clients can't
  reach `/admin`; the admin layout redirects them to `/portal`).

### Edge cases
- Re-registration after `rejected`: allowed — the prior `rejected` row is deleted before inserting.
- Email already a `users` row at approval time: request marked `approved` without a duplicate user.
- `RESEND_API_KEY` absent (e.g. dev/test): emails are skipped; all flows still succeed.

### Testing (Playwright, `e2e/client-signup.spec.ts`)
- Submit the register form → success message shown + a `pending` row exists in the DB.
- Register with an email that already exists as a `users` row → generic message, no new row.
- (Admin) approve a request → a `users` row with role `client` exists, request is `approved`, its
  `passwordHash` is null.
- The newly approved client can log in at `/portal/login` with the registration password.
- Reject a request → status `rejected` (+ `reviewNote`).
- Email is skipped in tests (`RESEND_API_KEY` unset for the test env) — assert the flow succeeds, not
  email contents. A seed/util helper creates requests + cleans up between runs (like `seed:client`).

### Migration & tooling
- `pnpm db:generate` + `pnpm db:migrate` for the new table + enum.
- No new required env; `ADMIN_NOTIFY_EMAIL` is optional (falls back to `marketing@vorcastudio.com`).
