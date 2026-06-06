# Phase 9 — Update E2E + Full Verification (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Playwright E2E suite to reflect the new admin-kit CMS (deterministic article data from Postgres, admin login smoke test), run the full verification gate (`pnpm build` + `pnpm audit` + all E2E), and produce a final migration sign-off checklist. This is the last phase.

**Architecture:**
- `e2e/articles.spec.ts` — currently skips if no Sanity data. Replace skip logic with DB-backed seed fixture or assume 15 migrated articles are present.
- Add `e2e/admin.spec.ts` — smoke test: login form renders, protected route redirects, login works.
- No new product code changes — Phase 9 is verification + test-only.

**Tech Stack:** `@playwright/test`, `pnpm exec playwright`, existing test utilities.

**Prerequisites:** All Phases 1–8 complete. 15 articles in Postgres. Admin user seeded. `pnpm build` green after Phase 8. Playwright suite at `19 passed` before this phase.

---

## Migration Roadmap (this plan = Phase 9)

1–8. ✓  9. **Phase 9 — E2E + full verification** ← this document ← FINAL

---

## Pre-flight

Phase 8 complete. Sanity removed. `pnpm audit` clean. `pnpm build` green. Working tree clean.

---

### Task 1: Create working branch

```bash
git switch -c phase-9-e2e-verification
```

---

### Task 2: Update articles E2E spec

**Files:** `e2e/articles.spec.ts`

The current `articles.spec.ts` has a `test.skip(!href, "No articles published in Sanity to open.")` guard. Now that 15 articles are in Postgres, this guard should never trigger in local dev or CI (assuming `DATABASE_URL` is set). Update the spec for reliability.

- [ ] **Step 1: Read the current spec**

```bash
cat e2e/articles.spec.ts
```

- [ ] **Step 2: Replace the Sanity-flavored skip with a clear failure message**

Change the skip guard:
```ts
test.skip(!href, "No articles published in Sanity to open.");
```
to:
```ts
if (!href) {
    throw new Error(
        "No article links found on /articles. Ensure DATABASE_URL is set and the DB has published articles."
    );
}
```

This converts a silent skip into an explicit failure — if the DB is empty, the test fails loudly rather than passing vacuously.

- [ ] **Step 3: Update the test comment** (if present)

Remove any comments referencing "Sanity" in `articles.spec.ts`.

---

### Task 3: Add admin smoke E2E spec

**Files:** `e2e/admin.spec.ts` (new)

These tests cover the minimum admin surface: login page renders, unauthenticated redirect works, login with valid credentials succeeds.

- [ ] **Step 1: Create `e2e/admin.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test.describe("Admin area", () => {
    test("login page renders", async ({ page }) => {
        await page.goto("/admin/login");
        await expect(page.getByRole("heading")).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.getByRole("button", { name: /masuk|sign in|login/i })).toBeVisible();
    });

    test("unauthenticated /admin redirects to login", async ({ page }) => {
        await page.goto("/admin");
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test("login with valid credentials reaches dashboard", async ({ page }) => {
        const email = process.env.ADMIN_EMAIL ?? "admin@vorcastudio.com";
        const password = process.env.ADMIN_PASSWORD;

        test.skip(!password, "Set ADMIN_PASSWORD env var to run admin login test");

        await page.goto("/admin/login");
        await page.locator('input[type="email"]').fill(email);
        await page.locator('input[type="password"]').fill(password!);
        await page.getByRole("button", { name: /masuk|sign in|login/i }).click();

        await expect(page).toHaveURL(/\/admin(?!\/login)/);
        await expect(page.getByRole("heading")).toBeVisible();
    });
});
```

**Note on the login test:** It is conditionally skipped when `ADMIN_PASSWORD` is not set. This makes it safe to run in CI without secrets. To run it locally: `ADMIN_PASSWORD=changeme123 pnpm test:e2e`. In CI, add `ADMIN_PASSWORD` as an environment secret and it will run automatically.

---

### Task 4: Update playwright.config.ts (if needed)

- [ ] **Step 1: Check the current timeout settings**

```bash
cat playwright.config.ts
```

The current config has `timeout: 30_000` and `expect.timeout: 10_000`. For the admin login test, authentication may take slightly longer in dev mode; if flaky, bump to `45_000` for the admin spec using `test.setTimeout`.

- [ ] **Step 2: Add ADMIN_EMAIL and ADMIN_PASSWORD to env passthrough (if CI)**

In `playwright.config.ts`, ensure the `webServer` block passes env vars:

No change needed — Playwright inherits the process environment by default.

---

### Task 5: Run the full E2E suite

- [ ] **Step 1: Run without ADMIN_PASSWORD (admin login test will skip)**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `21 passed` (19 original + 2 non-skip admin tests: login page renders + redirect). The credentials test is skipped → counted as `1 skipped`.

So: `21 passed, 1 skipped`.

- [ ] **Step 2: Run with ADMIN_PASSWORD to include the login test**

```bash
ADMIN_PASSWORD=changeme123 pnpm exec playwright test --reporter=line
```

Expected: `22 passed`.

---

### Task 6: Full verification checklist

Run each check and confirm it passes:

- [ ] **`pnpm build`** — production build green

```bash
pnpm build
```
Expected: `✓ Compiled successfully`.

- [ ] **`pnpm audit`** — no vulnerabilities

```bash
pnpm audit
```
Expected: `found 0 vulnerabilities`.

- [ ] **No Sanity imports** — codebase clean

```bash
grep -rn "sanity\|@sanity\|next-sanity\|portabletext" \
    app/ lib/ views/ components/ contexts/ db/ \
    --include="*.ts" --include="*.tsx" \
    | grep -v "node_modules" \
    | grep -v "migrate-from-sanity"
```
Expected: no output (zero matches).

- [ ] **Articles are served from Postgres**

```bash
pnpm tsx -e "
import { getAllArticles } from './lib/articles';
const arts = await getAllArticles();
console.log('Published articles from DB:', arts.length);
await process.exit(0);
"
```
Expected: `Published articles from DB: 15` (or however many were migrated).

- [ ] **`pnpm exec playwright test --reporter=line`** — suite green

Expected: `21 passed, 1 skipped` (or `22 passed` with `ADMIN_PASSWORD`).

- [ ] **Admin panel reachable**

```bash
pnpm dev > /tmp/dev-final.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/login
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin
kill %1
```
Expected: `/admin/login` → `200`, `/admin` → `307`.

---

### Task 7: Commit

```bash
git add e2e/
git commit -m "test: update E2E for Postgres articles + admin smoke tests (Phase 9)"
```

---

### Task 8: Merge all phases into main

At this point all 9 phase branches exist. Merge strategy: merge sequentially (each into the next), then merge the final branch into main. Or squash-merge each phase branch into main in order.

- [ ] **Step 1: Merge all phase branches into main**

```bash
git switch main
git merge phase-1-next16-admin-kit --no-ff -m "Phase 1: Next.js 16 + admin-kit setup"
git merge phase-2-database --no-ff -m "Phase 2: Drizzle ORM + Neon Postgres + articles schema"
git merge phase-3-auth-admin-shell --no-ff -m "Phase 3: NextAuth v5 + admin shell + built-in screens"
git merge phase-4-articles-admin --no-ff -m "Phase 4: Articles admin CRUD + Tiptap + R2 upload"
git merge phase-5-public-read-layer --no-ff -m "Phase 5: Public article read layer + HTML render + ISR"
git merge phase-6-data-migration --no-ff -m "Phase 6: Sanity → Postgres data migration"
git merge phase-7-r2-media --no-ff -m "Phase 7: R2 media finalization"
git merge phase-8-remove-sanity --no-ff -m "Phase 8: Remove Sanity CMS"
git merge phase-9-e2e-verification --no-ff -m "Phase 9: E2E update + full verification"
```

**Note:** If you are executing phases sequentially (each phase branches off the previous one's tip, not off `main`), then only the final phase branch needs to be merged into `main`.

- [ ] **Step 2: Final build + E2E on main**

```bash
pnpm build && pnpm exec playwright test --reporter=line
```

Expected: build green, 21+ tests passed.

---

## Sign-Off Checklist (final migration complete)

| Check | Expected |
|---|---|
| `pnpm build` | `✓ Compiled successfully` |
| `pnpm audit` | `found 0 vulnerabilities` |
| `pnpm exec playwright test` | 21+ passed, ≤1 skipped |
| `/articles` listing | Shows articles from Postgres |
| `/articles/<slug>` detail | HTML content renders, TOC visible |
| `/admin/login` | Login page renders |
| `/admin` (no auth) | Redirects to `/admin/login` |
| Admin articles list | Shows migrated articles |
| Admin create article | Saves to DB, revalidates public cache |
| Sanity grep | Zero matches in `app/`, `lib/`, `components/` |
| `pnpm audit` | Clean |

---

## Self-Review

- **Spec coverage:** §11 (E2E update, article spec, admin smoke test, full verification).
- **`test.skip(!password, ...)` pattern:** standard Playwright conditional skip — safe for CI without secrets, opt-in with env var.
- **Expected count 21 passed, 1 skipped:** 19 original + 2 admin tests (login renders + redirect) run always + 1 admin test (credentials) skipped without env var.
- **Sign-off checklist:** meant to be run manually by the human before merging to production. Captures the complete migration outcome in one glance.
