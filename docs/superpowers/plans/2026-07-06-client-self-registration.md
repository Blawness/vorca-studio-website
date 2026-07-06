# Client Self-Registration with Admin Approval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let visitors self-register for the client portal at `/portal/register`; a registration is a request an admin approves (creating the `client` account) or rejects, with email notifications throughout.

**Architecture:** A new app-local `clientSignupRequests` table holds pending requests (password hashed at registration). A public register page + server action inserts requests and emails the admin. A custom admin screen (`/admin/client-requests`, pattern like `projects`) approves — creating a `users` row with role `client` in a transaction and nulling the request's hash — or rejects, emailing the client in their chosen language. Reuses the single admin-kit NextAuth/`users` system; no second auth.

**Tech Stack:** Next.js 16 (App Router, `cacheComponents: true`), React 19, TypeScript, Drizzle ORM (postgres-js/Neon), NextAuth via `@blawness/admin-kit`, bcryptjs, Resend (via `fetch`), Tailwind v4, Playwright.

## Global Constraints

- **User/PK id type is integer** (admin-kit `users.id` is `serial`; `requireUserId()` returns `number`). New PKs are `serial`; FKs to `users.id` are `integer`.
- **`cacheComponents: true`** — `export const dynamic = "force-dynamic"` is DISALLOWED. Public pages become dynamic by awaiting `searchParams`; admin pages via the layout's cookie-reading auth. Do NOT add a `dynamic` export.
- **Drizzle client uses `prepare: false`** (already configured; don't change). Migrations are generated (`pnpm db:generate` + `pnpm db:migrate`), never hand-written.
- **Email is best-effort:** every `sendEmail` call is wrapped in try/catch so email failure never fails the primary action. If `RESEND_API_KEY` is unset, `sendEmail` is a logged no-op.
- **Password:** bcrypt cost 12; never stored or logged in plaintext. The request's `passwordHash` is **nulled after approval** (and after rejection).
- **Email enumeration:** the duplicate-registration message is generic ("already registered or being processed") — never reveal which state an email is in.
- **All UI copy goes through `LanguageContext`** (`useLanguage().t(key)`), keys added to BOTH `id` and `en` maps. `useLanguage()` returns `{ language: "id"|"en", setLanguage, t }`.
- **RBAC:** approve/reject actions gated by `requirePermission("clientRequests.review")`; the new permission is granted to `admin` (via `*`) and `editor`.
- Path alias `@/*` → repo root. This repo's only test runner is Playwright; infra/logic tasks are verified with `pnpm build` + explicit checks.
- **Admin address:** `process.env.ADMIN_NOTIFY_EMAIL ?? "marketing@vorcastudio.com"`. Email `from: "noreply@vorcastudio.com"`.

---

## File Structure

**Created:**
- `lib/email.ts` — `sendEmail({ to, subject, html })` Resend helper.
- `lib/signup-emails.ts` — three template builders (admin new-request, client approved, client rejected).
- `app/(portal)/portal/register/page.tsx` — register page host (reads `searchParams`).
- `app/(portal)/portal/register/RegisterForm.tsx` — register form (client).
- `app/(portal)/portal/register/actions.ts` — `submitSignupRequest`.
- `app/(admin)/admin/(protected)/client-requests/page.tsx` — request list.
- `app/(admin)/admin/(protected)/client-requests/[id]/page.tsx` — request detail + approve/reject.
- `app/(admin)/admin/(protected)/client-requests/actions.ts` — `approveRequestFormAction`, `rejectRequestFormAction`.
- `e2e/client-signup.spec.ts` — e2e.

**Modified:**
- `db/schema.ts` — add `clientSignupRequests` table + `signupRequestStatus` enum.
- `app/api/contact/route.ts` — use `sendEmail` helper.
- `rbac.ts` — add `clientRequests.review` to `editor` (admin already `*`).
- `app/(portal)/portal/login/LoginForm.tsx` — add a "Register" link.
- `app/(admin)/admin/(protected)/nav-icons.ts` — export `UserPlus`.
- `app/(admin)/admin/(protected)/layout.tsx` — add "Client Requests" nav item.
- `contexts/LanguageContext.tsx` — register + admin-screen keys (both maps).

---

## Task 1: Database schema & migration

**Files:**
- Modify: `db/schema.ts`
- Generated: `db/migrations/000X_*.sql`

**Interfaces:**
- Produces: table `clientSignupRequests` and enum `signupRequestStatus` exported from `@/db/schema`.

- [ ] **Step 1: Append the table to `db/schema.ts`**

Append (the file already imports several pg-core helpers for the project tables — add `boolean` is NOT needed; reuse existing imports, adding any missing ones like `pgEnum`, `serial`, `integer`, `text`, `timestamp` if not already imported at the point you add this):

```ts
export const signupRequestStatus = pgEnum("signup_request_status", [
    "pending",
    "approved",
    "rejected",
]);

export const clientSignupRequests = pgTable("client_signup_requests", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash"),
    company: text("company"),
    phone: text("phone"),
    note: text("note"),
    locale: text("locale").notNull().default("id"),
    status: signupRequestStatus("status").notNull().default("pending"),
    reviewNote: text("review_note"),
    reviewedByUserId: integer("reviewed_by_user_id").references(() => users.id, {
        onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

(If `users` is not already imported in `db/schema.ts`, it is — the project tables reference it via `import { users } from "@blawness/admin-kit/schema";`. Reuse that import.)

- [ ] **Step 2: Generate the migration**

Run: `pnpm db:generate`
Expected: a new `db/migrations/000X_*.sql` with `CREATE TYPE "signup_request_status"` and `CREATE TABLE "client_signup_requests"` including the `email` UNIQUE constraint and the `reviewed_by_user_id` FK `ON DELETE set null`. If drizzle-kit prompts for a name, use `client_signup_requests`.

- [ ] **Step 3: Apply the migration**

Run: `pnpm db:migrate`
Expected: applies with no error.

- [ ] **Step 4: Typecheck**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add db/schema.ts db/migrations
git commit -m "feat: add client_signup_requests schema"
```

---

## Task 2: Email helper & contact-route refactor

**Files:**
- Create: `lib/email.ts`
- Modify: `app/api/contact/route.ts`

**Interfaces:**
- Produces: `sendEmail(opts: { to: string | string[]; subject: string; html: string }): Promise<void>` from `@/lib/email`. No-op + `console.warn` when `RESEND_API_KEY` unset; throws on non-OK Resend response (callers catch).

- [ ] **Step 1: Create `lib/email.ts`**

```ts
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "noreply@vorcastudio.com";

/**
 * Send an email via Resend's REST API. If RESEND_API_KEY is unset this is a
 * logged no-op (dev/test). Throws on a non-OK response so callers can decide
 * whether to swallow it (they should — email is best-effort).
 */
export async function sendEmail(opts: {
    to: string | string[];
    subject: string;
    html: string;
}): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY not configured, skipping email:", opts.subject);
        return;
    }

    const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM,
            to: Array.isArray(opts.to) ? opts.to : [opts.to],
            subject: opts.subject,
            html: opts.html,
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to send email: ${res.status} ${res.statusText}`);
    }
}
```

- [ ] **Step 2: Refactor `app/api/contact/route.ts` to use it**

Replace the inline `sendContactEmail` body's `fetch(...)` block with a call to the helper. The new `sendContactEmail`:

```ts
import { sendEmail } from "@/lib/email";
// ...
async function sendContactEmail(contact: ContactRequest): Promise<void> {
    await sendEmail({
        to: ["marketing@vorcastudio.com"],
        subject: `New Contact Form Submission - ${contact.name}`,
        html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${contact.company || "Not provided"}</p>
        <p><strong>Service Type:</strong> ${contact.serviceType}</p>
        <p><strong>Language:</strong> ${contact.language}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `,
    });
}
```

Delete the now-unused `resendApiKey`/`fetch` code and the `RESEND_ENDPOINT` constants from the route (the helper owns them). Keep the existing outer try/catch in `POST` that swallows email errors.

- [ ] **Step 3: Typecheck + verify contact e2e still passes**

Run: `pnpm build`
Expected: succeeds.
Run: `pnpm test:e2e -- e2e/contact.spec.ts`
Expected: passes (unchanged behavior — the contact form still submits).

- [ ] **Step 4: Commit**

```bash
git add lib/email.ts "app/api/contact/route.ts"
git commit -m "refactor: extract Resend sendEmail helper and use it in contact route"
```

---

## Task 3: Signup email templates

**Files:**
- Create: `lib/signup-emails.ts`

**Interfaces:**
- Consumes: nothing (pure functions).
- Produces (from `@/lib/signup-emails`):
  - `adminNewRequestEmail(req: { id: number; name: string; email: string; company?: string; phone?: string; note?: string }): { subject: string; html: string }`
  - `clientApprovedEmail(opts: { locale: "id" | "en"; name: string }): { subject: string; html }`
  - `clientRejectedEmail(opts: { locale: "id" | "en"; name: string; reason?: string }): { subject: string; html }`

- [ ] **Step 1: Create `lib/signup-emails.ts`**

```ts
const SITE_URL = "https://www.vorcastudio.com";

export function adminNewRequestEmail(req: {
    id: number;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    note?: string;
}): { subject: string; html: string } {
    return {
        subject: `Pendaftaran klien baru — ${req.name}`,
        html: `
        <h2>Permintaan pendaftaran klien baru</h2>
        <p><strong>Nama:</strong> ${req.name}</p>
        <p><strong>Email:</strong> ${req.email}</p>
        <p><strong>Perusahaan:</strong> ${req.company || "-"}</p>
        <p><strong>No. HP:</strong> ${req.phone || "-"}</p>
        <p><strong>Catatan:</strong></p>
        <p>${req.note || "-"}</p>
        <p><a href="${SITE_URL}/admin/client-requests/${req.id}">Tinjau permintaan di admin</a></p>
      `,
    };
}

export function clientApprovedEmail(opts: {
    locale: "id" | "en";
    name: string;
}): { subject: string; html: string } {
    if (opts.locale === "en") {
        return {
            subject: "Your Vorca Studio account is approved",
            html: `
            <h2>Welcome, ${opts.name}!</h2>
            <p>Your client account has been approved. You can now log in to your project portal.</p>
            <p><a href="${SITE_URL}/portal/login">Log in to the portal</a></p>
          `,
        };
    }
    return {
        subject: "Akun Vorca Studio Anda telah disetujui",
        html: `
        <h2>Selamat datang, ${opts.name}!</h2>
        <p>Akun klien Anda telah disetujui. Anda sekarang bisa masuk ke portal project Anda.</p>
        <p><a href="${SITE_URL}/portal/login">Masuk ke portal</a></p>
      `,
    };
}

export function clientRejectedEmail(opts: {
    locale: "id" | "en";
    name: string;
    reason?: string;
}): { subject: string; html: string } {
    if (opts.locale === "en") {
        return {
            subject: "Update on your Vorca Studio registration",
            html: `
            <h2>Hi ${opts.name},</h2>
            <p>Thank you for your interest. We're unable to approve your registration at this time.</p>
            ${opts.reason ? `<p><strong>Note:</strong> ${opts.reason}</p>` : ""}
            <p>If you think this is a mistake, please contact us.</p>
          `,
        };
    }
    return {
        subject: "Kabar mengenai pendaftaran Vorca Studio Anda",
        html: `
        <h2>Halo ${opts.name},</h2>
        <p>Terima kasih atas minat Anda. Saat ini kami belum bisa menyetujui pendaftaran Anda.</p>
        ${opts.reason ? `<p><strong>Catatan:</strong> ${opts.reason}</p>` : ""}
        <p>Jika Anda merasa ini keliru, silakan hubungi kami.</p>
      `,
    };
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/signup-emails.ts
git commit -m "feat: add client signup email templates"
```

---

## Task 4: RBAC — clientRequests.review permission

**Files:**
- Modify: `rbac.ts`

**Interfaces:**
- Produces: permission `clientRequests.review` granted to `admin` (via `*`) and `editor`. `rbac.can("editor","clientRequests.review") === true`, `rbac.can("client","clientRequests.review") === false`.

- [ ] **Step 1: Write a throwaway check**

Create `scripts/_rbac-check2.mjs`:

```js
import "dotenv/config";
const { rbac } = await import("../rbac.ts");
const checks = [
    ["admin", "clientRequests.review", true],
    ["editor", "clientRequests.review", true],
    ["client", "clientRequests.review", false],
];
let ok = true;
for (const [role, perm, want] of checks) {
    const got = rbac.can(role, perm);
    if (got !== want) { ok = false; console.error(`FAIL ${role} ${perm}: got ${got} want ${want}`); }
}
console.log(ok ? "RBAC OK" : "RBAC FAILED");
process.exit(ok ? 0 : 1);
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm exec tsx scripts/_rbac-check2.mjs`
Expected: FAIL on `editor clientRequests.review`.

- [ ] **Step 3: Add the permission in `rbac.ts`**

In the `editor` role array (which already lists the four `projects.*` permissions), add `"clientRequests.review"`:

```ts
        editor: [
            ...editorPerms,
            "projects.read",
            "projects.create",
            "projects.update",
            "projects.delete",
            "clientRequests.review",
        ],
```

- [ ] **Step 4: Run the check to see it pass**

Run: `pnpm exec tsx scripts/_rbac-check2.mjs`
Expected: `RBAC OK`.

- [ ] **Step 5: Remove the throwaway and commit**

```bash
rm scripts/_rbac-check2.mjs
git add rbac.ts
git commit -m "feat: add clientRequests.review permission"
```

---

## Task 5: Public registration page, action & login link (with e2e)

**Files:**
- Create: `app/(portal)/portal/register/actions.ts`
- Create: `app/(portal)/portal/register/RegisterForm.tsx`
- Create: `app/(portal)/portal/register/page.tsx`
- Modify: `app/(portal)/portal/login/LoginForm.tsx`
- Modify: `contexts/LanguageContext.tsx`
- Create/Modify: `e2e/client-signup.spec.ts`

**Interfaces:**
- Consumes: `sendEmail` (Task 2), `adminNewRequestEmail` (Task 3), `clientSignupRequests` + `users` (Task 1).
- Produces: `submitSignupRequest(formData: FormData)` server action; `/portal/register` page.

- [ ] **Step 1: Add register i18n keys to `contexts/LanguageContext.tsx`**

Add to BOTH `id` and `en` maps (English shown; provide the Indonesian on the left). Follow the file's existing style, near the `portal.*` keys:
```
"portal.register.title"      → "Daftar Klien" / "Client Registration"
"portal.register.name"       → "Nama" / "Name"
"portal.register.email"      → "Email" / "Email"
"portal.register.password"   → "Kata sandi" / "Password"
"portal.register.confirm"    → "Konfirmasi kata sandi" / "Confirm password"
"portal.register.company"    → "Perusahaan" / "Company"
"portal.register.phone"      → "No. HP / WhatsApp" / "Phone / WhatsApp"
"portal.register.note"       → "Catatan / kebutuhan" / "Notes / needs"
"portal.register.submit"     → "Daftar" / "Register"
"portal.register.haveAccount"→ "Sudah punya akun? Masuk" / "Already have an account? Log in"
"portal.register.success"    → "Pendaftaran terkirim. Menunggu persetujuan admin." / "Registration submitted. Awaiting admin approval."
"portal.register.errorValidation" → "Periksa kembali isian Anda (kata sandi minimal 8 karakter & harus cocok)." / "Please check your input (password min 8 chars and must match)."
"portal.register.errorExists"→ "Email ini sudah terdaftar atau sedang diproses." / "This email is already registered or is being processed."
"portal.login.register"      → "Belum punya akun? Daftar" / "No account? Register"
```

- [ ] **Step 2: Create `register/actions.ts`**

```ts
"use server";

import { db } from "@/db";
import { users, clientSignupRequests } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { adminNewRequestEmail } from "@/lib/signup-emails";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const SignupSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        company: z.string().optional(),
        phone: z.string().optional(),
        note: z.string().optional(),
        locale: z.enum(["id", "en"]).default("id"),
    })
    .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"] });

export async function submitSignupRequest(formData: FormData) {
    // Honeypot: bots fill hidden "website" field. Silently succeed.
    if (String(formData.get("website") ?? "").trim() !== "") {
        redirect("/portal/register?success=1");
    }

    const parsed = SignupSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) redirect("/portal/register?error=validation");

    const { name, email, password, company, phone, note, locale } = parsed.data;
    const emailNorm = email.toLowerCase().trim();

    const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, emailNorm))
        .limit(1);
    const [existingReq] = await db
        .select({ id: clientSignupRequests.id, status: clientSignupRequests.status })
        .from(clientSignupRequests)
        .where(eq(clientSignupRequests.email, emailNorm))
        .limit(1);

    // Block if a user already exists, or a non-rejected request is on file.
    if (existingUser || (existingReq && existingReq.status !== "rejected")) {
        redirect("/portal/register?error=exists");
    }

    // A prior rejected request would violate the unique email; remove it.
    if (existingReq?.status === "rejected") {
        await db.delete(clientSignupRequests).where(eq(clientSignupRequests.id, existingReq.id));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [row] = await db
        .insert(clientSignupRequests)
        .values({
            name,
            email: emailNorm,
            passwordHash,
            company: company || null,
            phone: phone || null,
            note: note || null,
            locale,
        })
        .returning({ id: clientSignupRequests.id });

    try {
        const { subject, html } = adminNewRequestEmail({
            id: row.id,
            name,
            email: emailNorm,
            company,
            phone,
            note,
        });
        await sendEmail({
            to: process.env.ADMIN_NOTIFY_EMAIL ?? "marketing@vorcastudio.com",
            subject,
            html,
        });
    } catch (e) {
        console.error("signup admin email failed", e);
    }

    redirect("/portal/register?success=1");
}
```

- [ ] **Step 3: Create `register/RegisterForm.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitSignupRequest } from "./actions";

export function RegisterForm({ status }: { status?: "success" | "validation" | "exists" }) {
    const { t, language } = useLanguage();

    if (status === "success") {
        return (
            <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-slate-900">{t("portal.register.title")}</h1>
                <p className="mt-4 text-sm text-green-700">{t("portal.register.success")}</p>
                <Link href="/portal/login" className="mt-4 inline-block text-sm text-slate-600 hover:underline">
                    {t("portal.register.haveAccount")}
                </Link>
            </div>
        );
    }

    return (
        <form action={submitSignupRequest} className="w-full max-w-sm space-y-3 rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">{t("portal.register.title")}</h1>
            {status === "validation" && <p className="text-sm text-red-600">{t("portal.register.errorValidation")}</p>}
            {status === "exists" && <p className="text-sm text-red-600">{t("portal.register.errorExists")}</p>}

            <input type="hidden" name="locale" value={language} />
            {/* Honeypot: hidden from users, tempting to bots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.name")}</span>
                <input name="name" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.email")}</span>
                <input name="email" type="email" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.password")}</span>
                <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.confirm")}</span>
                <input name="confirmPassword" type="password" required minLength={8} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.company")}</span>
                <input name="company" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.phone")}</span>
                <input name="phone" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.note")}</span>
                <textarea name="note" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>

            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                {t("portal.register.submit")}
            </button>
            <Link href="/portal/login" className="block text-center text-sm text-slate-600 hover:underline">
                {t("portal.register.haveAccount")}
            </Link>
        </form>
    );
}
```

- [ ] **Step 4: Create `register/page.tsx`**

```tsx
import { RegisterForm } from "./RegisterForm";

export default async function PortalRegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string }>;
}) {
    const { success, error } = await searchParams;
    const status = success === "1" ? "success" : error === "validation" ? "validation" : error === "exists" ? "exists" : undefined;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <RegisterForm status={status} />
        </div>
    );
}
```

- [ ] **Step 5: Add a "Register" link to `login/LoginForm.tsx`**

In `app/(portal)/portal/login/LoginForm.tsx`, add a link below the submit button (inside the form or right after it), using the existing `t` from `useLanguage()`:

```tsx
            <Link href="/portal/register" className="block text-center text-sm text-slate-600 hover:underline">
                {t("portal.login.register")}
            </Link>
```
Add `import Link from "next/link";` at the top if not present.

- [ ] **Step 6: Write the e2e (`e2e/client-signup.spec.ts`)**

```ts
import { test, expect } from "@playwright/test";

// A unique email per run so reruns don't collide.
const unique = `signup-${Date.now()}@example.com`;

test("visitor submits a registration request", async ({ page }) => {
    await page.goto("/portal/register");
    await page.fill('input[name="name"]', "Test Registrant");
    await page.fill('input[name="email"]', unique);
    await page.fill('input[name="password"]', "supersecret1");
    await page.fill('input[name="confirmPassword"]', "supersecret1");
    await page.fill('input[name="company"]', "Test Co");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/portal\/register\?success=1/);
    await expect(page.getByText(/Awaiting admin approval|Menunggu persetujuan admin/)).toBeVisible();
});

test("registering with an existing user email is rejected generically", async ({ page }) => {
    // `pnpm seed:client` creates a user client@example.com — reuse it as an existing account.
    await page.goto("/portal/register");
    await page.fill('input[name="name"]', "Dup");
    await page.fill('input[name="email"]', "client@example.com");
    await page.fill('input[name="password"]', "supersecret1");
    await page.fill('input[name="confirmPassword"]', "supersecret1");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/portal\/register\?error=exists/);
    await expect(page.getByText(/already registered or is being processed|sudah terdaftar atau sedang diproses/)).toBeVisible();
});
```

- [ ] **Step 7: Run the e2e (RED then GREEN)**

Before implementing (if doing strict TDD, write the spec first): `pnpm test:e2e -- e2e/client-signup.spec.ts` → FAIL (route missing).
After implementing: run `pnpm seed:client` (ensures `client@example.com` user exists for the duplicate test), then:
Run: `pnpm test:e2e -- e2e/client-signup.spec.ts`
Expected: both tests PASS. Also run `pnpm build` → succeeds.

- [ ] **Step 8: Commit**

```bash
git add "app/(portal)/portal/register" "app/(portal)/portal/login/LoginForm.tsx" contexts/LanguageContext.tsx e2e/client-signup.spec.ts
git commit -m "feat: add public client registration request flow with e2e"
```

---

## Task 6: Admin review screen & approve/reject (with e2e)

**Files:**
- Create: `app/(admin)/admin/(protected)/client-requests/actions.ts`
- Create: `app/(admin)/admin/(protected)/client-requests/page.tsx`
- Create: `app/(admin)/admin/(protected)/client-requests/[id]/page.tsx`
- Modify: `app/(admin)/admin/(protected)/nav-icons.ts`
- Modify: `app/(admin)/admin/(protected)/layout.tsx`
- Modify: `contexts/LanguageContext.tsx`
- Modify: `e2e/client-signup.spec.ts`

**Interfaces:**
- Consumes: `requirePermission`, `requireUserId` from `@blawness/admin-kit/auth-helpers`; `sendEmail` (Task 2); `clientApprovedEmail`, `clientRejectedEmail` (Task 3); `clientSignupRequests`, `users` (Task 1).
- Produces: `approveRequestFormAction(formData)`, `rejectRequestFormAction(formData)`.

- [ ] **Step 1: Add admin-screen i18n keys to `contexts/LanguageContext.tsx`**

The admin screen is staff-facing; the labels can be Indonesian in both maps if you prefer, but add keys to BOTH maps for consistency. Add:
```
"admin.clientRequests.title"  → "Permintaan Klien" / "Client Requests"
```
(The rest of the admin screen text is inline in the pages below and does not need translation keys — the admin CMS is Indonesian-first; keep the inline English labels used in the code below as-is to match the existing admin screens' mixed convention.)

- [ ] **Step 2: Create `client-requests/actions.ts`**

```ts
"use server";

import { db } from "@/db";
import { users, clientSignupRequests } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { clientApprovedEmail, clientRejectedEmail } from "@/lib/signup-emails";
import { requirePermission, requireUserId } from "@blawness/admin-kit/auth-helpers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function approveRequestFormAction(formData: FormData) {
    await requirePermission("clientRequests.review");
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;
    const reviewer = await requireUserId();

    let notify: { locale: "id" | "en"; name: string; email: string } | null = null;

    await db.transaction(async (tx) => {
        const [req] = await tx
            .select()
            .from(clientSignupRequests)
            .where(eq(clientSignupRequests.id, id))
            .limit(1);
        if (!req || req.status !== "pending") return; // idempotent guard

        const [existingUser] = await tx
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, req.email))
            .limit(1);

        if (!existingUser && req.passwordHash) {
            await tx.insert(users).values({
                email: req.email,
                name: req.name,
                passwordHash: req.passwordHash,
                role: "client",
            });
        }

        await tx
            .update(clientSignupRequests)
            .set({
                status: "approved",
                reviewedByUserId: reviewer,
                reviewedAt: new Date(),
                passwordHash: null, // hash now lives only in users
            })
            .where(eq(clientSignupRequests.id, id));

        notify = { locale: (req.locale as "id" | "en") ?? "id", name: req.name, email: req.email };
    });

    if (notify) {
        try {
            const { subject, html } = clientApprovedEmail({ locale: notify.locale, name: notify.name });
            await sendEmail({ to: notify.email, subject, html });
        } catch (e) {
            console.error("approve email failed", e);
        }
    }

    revalidatePath("/admin/client-requests");
    redirect("/admin/client-requests?success=approved");
}

export async function rejectRequestFormAction(formData: FormData) {
    await requirePermission("clientRequests.review");
    const id = Number(formData.get("id"));
    const reviewNote = String(formData.get("reviewNote") ?? "").trim() || null;
    if (!Number.isInteger(id)) return;
    const reviewer = await requireUserId();

    const [req] = await db
        .select()
        .from(clientSignupRequests)
        .where(eq(clientSignupRequests.id, id))
        .limit(1);
    if (!req || req.status !== "pending") {
        redirect("/admin/client-requests");
    }

    await db
        .update(clientSignupRequests)
        .set({
            status: "rejected",
            reviewNote,
            reviewedByUserId: reviewer,
            reviewedAt: new Date(),
            passwordHash: null, // no longer needed
        })
        .where(eq(clientSignupRequests.id, id));

    try {
        const { subject, html } = clientRejectedEmail({
            locale: (req.locale as "id" | "en") ?? "id",
            name: req.name,
            reason: reviewNote ?? undefined,
        });
        await sendEmail({ to: req.email, subject, html });
    } catch (e) {
        console.error("reject email failed", e);
    }

    revalidatePath("/admin/client-requests");
    redirect("/admin/client-requests?success=rejected");
}
```

- [ ] **Step 3: Create `client-requests/page.tsx` (list)**

```tsx
import Link from "next/link";
import { db } from "@/db";
import { clientSignupRequests } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function ClientRequestsPage() {
    const rows = await db
        .select({
            id: clientSignupRequests.id,
            name: clientSignupRequests.name,
            email: clientSignupRequests.email,
            company: clientSignupRequests.company,
            status: clientSignupRequests.status,
            createdAt: clientSignupRequests.createdAt,
        })
        .from(clientSignupRequests)
        .orderBy(desc(clientSignupRequests.createdAt));

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">Client Requests</h1>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-gray-500">
                        <th className="py-2">Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-b">
                            <td className="py-2">
                                <Link className="text-brand hover:underline" href={`/admin/client-requests/${r.id}`}>
                                    {r.name}
                                </Link>
                            </td>
                            <td>{r.email}</td>
                            <td>{r.company ?? "—"}</td>
                            <td>{r.status}</td>
                            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-400">
                                No requests yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
```

- [ ] **Step 4: Create `client-requests/[id]/page.tsx` (detail + approve/reject)**

```tsx
import { notFound } from "next/navigation";
import { db } from "@/db";
import { clientSignupRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { approveRequestFormAction, rejectRequestFormAction } from "../actions";

export default async function ClientRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const reqId = Number(id);
    if (!Number.isInteger(reqId)) notFound();

    const [req] = await db
        .select()
        .from(clientSignupRequests)
        .where(eq(clientSignupRequests.id, reqId))
        .limit(1);
    if (!req) notFound();

    return (
        <div className="max-w-xl p-6">
            <h1 className="mb-4 text-2xl font-semibold">{req.name}</h1>
            <dl className="space-y-1 text-sm">
                <div><dt className="inline font-medium">Email: </dt><dd className="inline">{req.email}</dd></div>
                <div><dt className="inline font-medium">Company: </dt><dd className="inline">{req.company ?? "—"}</dd></div>
                <div><dt className="inline font-medium">Phone: </dt><dd className="inline">{req.phone ?? "—"}</dd></div>
                <div><dt className="inline font-medium">Language: </dt><dd className="inline">{req.locale}</dd></div>
                <div><dt className="inline font-medium">Status: </dt><dd className="inline">{req.status}</dd></div>
                <div className="pt-2"><dt className="font-medium">Note:</dt><dd className="whitespace-pre-wrap">{req.note ?? "—"}</dd></div>
                {req.reviewNote && (
                    <div className="pt-2"><dt className="font-medium">Review note:</dt><dd className="whitespace-pre-wrap">{req.reviewNote}</dd></div>
                )}
            </dl>

            {req.status === "pending" && (
                <div className="mt-6 space-y-4">
                    <form action={approveRequestFormAction}>
                        <input type="hidden" name="id" value={req.id} />
                        <button type="submit" className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white">
                            Approve
                        </button>
                    </form>
                    <form action={rejectRequestFormAction} className="space-y-2">
                        <input type="hidden" name="id" value={req.id} />
                        <textarea name="reviewNote" placeholder="Reason (optional)" className="w-full rounded border px-3 py-2 text-sm" />
                        <button type="submit" className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white">
                            Reject
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
```

- [ ] **Step 5: Add the `UserPlus` icon export**

In `app/(admin)/admin/(protected)/nav-icons.ts`, add `UserPlus` to the lucide re-export list (same single-line style as the existing exports).

- [ ] **Step 6: Add the nav item**

In `app/(admin)/admin/(protected)/layout.tsx`: import `UserPlus` from `"./nav-icons"`, and add to `navItems` (after "Projects"):
```tsx
{ label: "Client Requests", href: "/admin/client-requests", icon: <UserPlus className="h-4 w-4" />, requires: "clientRequests.review" },
```

- [ ] **Step 7: Add the approval e2e (admin-gated) to `e2e/client-signup.spec.ts`**

Append. This mirrors `e2e/admin.spec.ts`'s `test.skip(!ADMIN_PASSWORD)` pattern — it only runs when an admin account is available.

```ts
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@vorcastudio.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test("admin approves a request and the new client can log in", async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, "Set ADMIN_PASSWORD (and seed the admin) to run this test");

    const email = `approve-${Date.now()}@example.com`;
    const password = "supersecret1";

    // 1. Visitor registers.
    await page.goto("/portal/register");
    await page.fill('input[name="name"]', "Approve Me");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/success=1/);

    // 2. Admin logs in and approves.
    await page.goto("/admin/login");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /masuk|sign in|login/i }).click();
    await expect(page).toHaveURL(/\/admin(?!\/login)/);

    await page.goto("/admin/client-requests");
    await page.getByRole("link", { name: "Approve Me" }).click();
    await page.getByRole("button", { name: "Approve" }).click();
    await expect(page).toHaveURL(/client-requests\?success=approved/);

    // 3. Log the admin out, then the new client logs in.
    await page.context().clearCookies();
    await page.goto("/portal/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/portal(\/.*)?$/);
});
```

- [ ] **Step 8: Run the e2e + build**

Ensure an admin exists: `ADMIN_PASSWORD=supersecret1 pnpm seed:admin` (sets `admin@vorcastudio.com`). Then:
Run: `ADMIN_PASSWORD=supersecret1 pnpm test:e2e -- e2e/client-signup.spec.ts`
Expected: the two public tests PASS and the approval test PASS (not skipped). Also `pnpm build` → succeeds.
(If `ADMIN_PASSWORD` is unset, the approval test is skipped and the two public tests still pass.)

- [ ] **Step 9: Commit**

```bash
git add "app/(admin)/admin/(protected)/client-requests" "app/(admin)/admin/(protected)/nav-icons.ts" "app/(admin)/admin/(protected)/layout.tsx" contexts/LanguageContext.tsx e2e/client-signup.spec.ts
git commit -m "feat: add admin client-request review screen with approve/reject and e2e"
```

---

## Self-Review Notes

- **Spec coverage:** Data model (`clientSignupRequests` + `locale`) → Task 1. Email helper + contact refactor → Task 2. Three templates → Task 3. RBAC `clientRequests.review` → Task 4. Public register page/action, honeypot, generic duplicate message, admin email, login link, register i18n → Task 5. Admin review screen, approve (transaction, null hash, existing-user guard, idempotent), reject (+reviewNote, null hash), nav, client emails, approval e2e → Task 6.
- **Password:** hashed at registration (Task 5), copied to `users` and nulled on approval (Task 6), nulled on rejection (Task 6). Never plaintext.
- **cacheComponents:** no `dynamic` export anywhere; register page awaits `searchParams`; admin pages dynamic via layout auth. Verified against constraint.
- **Enumeration:** duplicate → generic `error=exists` message (Task 5).
- **Type consistency:** `submitSignupRequest(formData)`, `approveRequestFormAction(formData)`, `rejectRequestFormAction(formData)`, `sendEmail({to,subject,html})`, and the three `*Email({...})` builders match between their definitions and consumers. `locale` typed `"id" | "en"` throughout. Integer ids.
- **Testing note:** public tests run always; the approval e2e follows the repo's `test.skip(!ADMIN_PASSWORD)` convention (`e2e/admin.spec.ts`) and needs `pnpm seed:admin` + `pnpm seed:client`. Emails are no-ops in the test env (no `RESEND_API_KEY`), so tests assert flow, not email content.
