# Phase 3 — Auth + Admin Shell + admin-kit Screens (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire NextAuth v5 (from admin-kit), mount the admin shell layout with sidebar, serve the built-in `login`, `media`, and `users` screens, protect `/admin/*` routes via the auth middleware, and create the first admin user via seed script — all before any articles screen exists.

**Architecture:** Auth uses `@blawness/admin-kit/auth` (Credentials provider, JWT, bcryptjs). The route group `app/(admin)/admin/` holds the shell layout and three screen pages. `middleware.ts` at the project root uses `authConfig` from admin-kit to protect `/admin/*` (except `/admin/login`). `scripts/seed-admin.ts` hashes a password and inserts the first user.

**Tech Stack:** `@blawness/admin-kit@^0.2.0`, `next-auth@^5` (beta — pulled as a peer dep of admin-kit, do NOT install separately unless the build demands it), `bcryptjs` (pulled by admin-kit), `AUTH_SECRET` env var.

**Prerequisites:** Phase 2 complete. `DATABASE_URL` set. Tables `users`, `media`, `articles` exist in Neon.

---

## Migration Roadmap (this plan = Phase 3)

1. Phase 1 ✓  2. Phase 2 ✓
3. **Phase 3 — Auth + admin shell** ← this document
4. Phase 4 — Articles admin screen
5. Phase 5 — Public read layer + HTML render + ISR
6. Phase 6 — Data migration Sanity → Postgres
7. Phase 7 — R2 media finalization
8. Phase 8 — Remove Sanity
9. Phase 9 — Update E2E + full verification

---

## Pre-flight

Phase 2 complete. `DATABASE_URL` + Neon tables verified. `pnpm build` green, `19 passed` E2E. Working tree clean.

---

### Task 1: Create working branch

- [ ] **Step 1:**

```bash
git switch -c phase-3-auth-admin-shell
```

---

### Task 2: Add AUTH_SECRET to environment

**Files:** `.env.local`, `.env.example`

`AUTH_SECRET` is a random 32-byte base64 string required by NextAuth v5.

- [ ] **Step 1: Generate a secret**

```bash
openssl rand -base64 32
```

Copy the output.

- [ ] **Step 2: Add to .env.local**

```
AUTH_SECRET=<paste value here>
```

`.env.example` already has `AUTH_SECRET=` as a placeholder (added in Phase 2). Nothing to change there.

---

### Task 3: Create the NextAuth v5 route handler

**Files:** `app/api/auth/[...nextauth]/route.ts` (new)

- [ ] **Step 1: Create the file**

```ts
import { handlers } from "@blawness/admin-kit/auth";

export const { GET, POST } = handlers;
```

---

### Task 4: Create root middleware to protect /admin/*

**Files:** `middleware.ts` (new, at project root next to `next.config.mjs`)

- [ ] **Step 1: Create `middleware.ts`**

```ts
import NextAuth from "next-auth";
import { authConfig } from "@blawness/admin-kit/auth/config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
    matcher: ["/admin/:path*"],
};
```

The `authConfig.callbacks.authorized` in admin-kit already handles:
- Unauthenticated users → redirect to `/admin/login`
- Authenticated users on `/admin/login` → redirect to `/admin`

---

### Task 5: Create the admin route group and shell layout

**Files:**
- `app/(admin)/admin/layout.tsx` (new)
- `app/(admin)/admin/page.tsx` (new — simple dashboard placeholder)

- [ ] **Step 1: Create the layout**

```tsx
import { AdminLayout } from "@blawness/admin-kit/shell";
import { NavItem } from "@blawness/admin-kit/shell/sidebar";
import { requireUser } from "@blawness/admin-kit/auth-helpers";

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Artikel", href: "/admin/articles", icon: "FileText" },
    { label: "Media", href: "/admin/media", icon: "Image" },
    { label: "Users", href: "/admin/users", icon: "Users" },
];

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireUser();

    return (
        <AdminLayout navItems={navItems} brandName="Vorca Studio">
            {children}
        </AdminLayout>
    );
}
```

**Note on icon values:** The `icon` field type depends on admin-kit's `NavItem` definition. If it expects a Lucide icon name string, the values above are correct. If it expects a React component, replace the strings with the appropriate import. Run `pnpm build` to catch any type error and adjust accordingly.

- [ ] **Step 2: Create the dashboard placeholder page**

```tsx
export default function AdminDashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
                Selamat datang di Vorca Studio CMS.
            </p>
        </div>
    );
}
```

---

### Task 6: Mount the built-in Login screen

**Files:** `app/(admin)/admin/login/page.tsx` (new)

- [ ] **Step 1: Create the login page**

```tsx
import { LoginScreen } from "@blawness/admin-kit/screens/login";
import { loginAction } from "@blawness/admin-kit/screens/login/actions";

export default function AdminLoginPage() {
    return <LoginScreen />;
}
```

**Note:** `LoginScreen` is a self-contained component. `loginAction` is the server action it calls internally — admin-kit wires it automatically. No props needed.

---

### Task 7: Mount the built-in Media screen

**Files:** `app/(admin)/admin/media/page.tsx` (new)

- [ ] **Step 1: Create the media page**

```tsx
import { MediaLibraryScreen } from "@blawness/admin-kit/screens/media";
import { handleDeleteMedia } from "@blawness/admin-kit/screens/media/lib";

async function deleteAction(formData: FormData) {
    "use server";
    // No articles reference checker needed yet — Phase 4 will add one
    return handleDeleteMedia(formData, async () => false);
}

export default function AdminMediaPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    return (
        <MediaLibraryScreen
            deleteAction={deleteAction}
            searchParams={searchParams}
        />
    );
}
```

**Note on `referenceChecker`:** The second arg to `handleDeleteMedia` checks whether a media URL is referenced by any article before deleting. We pass `async () => false` (never blocked) at this stage because the `articles` table queries come in Phase 4. Update this function in Phase 4 to actually query the DB.

---

### Task 8: Mount the built-in Users screen

**Files:** `app/(admin)/admin/users/page.tsx` (new)

- [ ] **Step 1: Create the users page**

```tsx
import { UsersScreen } from "@blawness/admin-kit/screens/users";

export default function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    return <UsersScreen searchParams={searchParams} />;
}
```

---

### Task 9: Create the admin seed script

**Files:** `scripts/seed-admin.ts` (new)

This is a one-shot CLI script. It inserts (or updates) an admin user in the `users` table.

- [ ] **Step 1: Create `scripts/seed-admin.ts`**

```ts
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const EMAIL = process.env.ADMIN_EMAIL ?? "admin@vorcastudio.com";
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!PASSWORD) {
    console.error("Usage: ADMIN_PASSWORD=<secret> pnpm tsx scripts/seed-admin.ts");
    process.exit(1);
}

const passwordHash = await bcrypt.hash(PASSWORD, 12);

const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, EMAIL))
    .limit(1);

if (existing.length > 0) {
    await db
        .update(users)
        .set({ passwordHash, role: "admin" })
        .where(eq(users.email, EMAIL));
    console.log(`Updated existing user: ${EMAIL}`);
} else {
    await db.insert(users).values({
        email: EMAIL,
        name: "Vorca Admin",
        passwordHash,
        role: "admin",
    });
    console.log(`Created admin user: ${EMAIL}`);
}

process.exit(0);
```

- [ ] **Step 2: Add seed script to package.json**

In `package.json` `"scripts"`:
```json
    "seed:admin": "tsx scripts/seed-admin.ts",
```

- [ ] **Step 3: Run the seed**

```bash
ADMIN_PASSWORD=changeme123 pnpm seed:admin
```

Expected: `Created admin user: admin@vorcastudio.com`. After this, the login at `/admin/login` should work with `admin@vorcastudio.com` / `changeme123`.

---

### Task 10: Tailwind token wiring for admin-kit UI

**Files:** `app/globals.css` (or `tailwind.config.ts` if it exists)

Admin-kit components use custom tokens: `navy`, `brand`, `gold`. Without these, the admin UI compiles but renders without those colors.

- [ ] **Step 1: Check how Tailwind v4 is configured**

```bash
grep -n "content\|source\|@import" app/globals.css | head -20
```

In Tailwind v4, configuration is CSS-based (no `tailwind.config.ts` by default).

- [ ] **Step 2: Add admin-kit to Tailwind scan sources**

In `app/globals.css`, ensure the `@source` directive includes the admin-kit package path:

```css
@import "tailwindcss";
@source "../node_modules/@blawness/admin-kit/src/**/*.{tsx,ts}";
```

If `@import "tailwindcss"` already exists, add the `@source` line immediately after it.

- [ ] **Step 3: Define the custom tokens**

Add to `app/globals.css` (inside `:root` or as Tailwind v4 CSS variables):

```css
@theme {
    --color-navy: #0f172a;
    --color-brand: #06b6d4;
    --color-gold: #f59e0b;
}
```

Adjust the hex values to match Vorca Studio's brand if admin-kit documents specific values.

---

### Task 11: Build and smoke test the admin routes

- [ ] **Step 1: Build**

```bash
pnpm build 2>&1 | tee /tmp/phase3-build.log
```

Expected: `✓ Compiled successfully`. Routes `/admin`, `/admin/login`, `/admin/media`, `/admin/users` appear in the route table.

- [ ] **Step 2: Smoke-check the login page in dev**

```bash
pnpm dev > /tmp/dev-phase3.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/login
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin
kill %1
```

Expected:
- `/admin/login` → `200`
- `/admin` (unauthenticated) → `307` redirect to login

- [ ] **Step 3: Run E2E tests**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed`. Admin routes are not yet covered by E2E; existing guest specs must stay green.

---

### Task 12: Commit

```bash
git add app/(admin)/ app/api/auth/ middleware.ts scripts/seed-admin.ts package.json pnpm-lock.yaml .env.example
git commit -m "feat: wire NextAuth v5 + admin shell + login/media/users screens (Phase 3)"
```

---

## Self-Review

- **Spec coverage:** §5 (auth, shell, screens/login, screens/media, screens/users, seed admin).
- **`prepare: false`:** inherited from `db/index.ts` (Phase 2) — no change needed here.
- **referenceChecker stub:** `async () => false` is intentional; will be updated in Phase 4.
- **NavItem icons:** marked with a note because admin-kit type may differ; build will catch it.
- **Tailwind tokens:** required for admin-kit UI to render correctly — do not skip.
- **No public route change:** middleware matcher is `/admin/:path*` only; guest E2E unaffected.
