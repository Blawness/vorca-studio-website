# Phase 1 — Next.js 16 Upgrade + @blawness/admin-kit Setup (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the project to Next.js 16 and make `@blawness/admin-kit` consumable in the build, without touching any product behavior yet.

**Architecture:** Pure dependency/config groundwork. Bump Next 15→16 (React/react-dom are already 19.2.7), add `@blawness/admin-kit` from npm, wire `transpilePackages` + pnpm build-script allowance, and prove end-to-end consumption with a throwaway import that is removed before the phase ends. The existing public site and Playwright suite remain the regression gate.

**Tech Stack:** Next.js 16, React 19.2, pnpm 10, Playwright, `@blawness/admin-kit@^0.2.0`.

---

## Migration Roadmap (this plan = Phase 1)

Each phase gets its own plan + execution cycle. Detail the next plan only when the current one lands green.

1. **Phase 1 — Next 16 + admin-kit setup** ← this document
2. Phase 2 — Database: drizzle-kit, `db/schema.ts` (+ `articles`), `DATABASE_URL`, migrate
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

Current state (verified 2026-06-06): `next@15.5.19`, `react@19.2.7`,
`react-dom@19.2.7`, `tsx@4.22.4` available via `pnpm exec`, latest Next is
`16.2.7`. Working tree is clean and on `main`.

---

### Task 1: Create the working branch

**Files:** none (git only)

- [ ] **Step 1: Branch off main**

Run:
```bash
git switch -c phase-1-next16-admin-kit
```
Expected: `Switched to a new branch 'phase-1-next16-admin-kit'`

---

### Task 2: Upgrade Next.js 15 → 16

**Files:**
- Modify: `package.json` (the `next` dependency, and `@types/react`/`eslint` only if the build demands it)

- [ ] **Step 1: Capture the current green baseline**

Run:
```bash
pnpm build
```
Expected: `✓ Compiled successfully`, `✓ Generating static pages (19/19)`. If this
fails, stop — the tree was not green before starting.

- [ ] **Step 2: Bump the Next.js version**

In `package.json`, change the `next` dependency:
```json
    "next": "^16.2.7",
```

- [ ] **Step 3: Install**

Run:
```bash
pnpm install
```
Expected: exit 0, `pnpm-lock.yaml` updated, `next 16.2.7` resolved. Peer-dep
warnings about react are fine (react is already 19.2.7).

- [ ] **Step 4: Build and read the output carefully**

Run:
```bash
pnpm build 2>&1 | tee /tmp/next16-build.log
```
Expected: ideally `✓ Compiled successfully`. The app already uses async
`params: Promise<{...}>` and `export const dynamic = 'force-dynamic'`, which are
Next 16-compatible, so a clean pass is likely.

- [ ] **Step 5: If (and only if) the build fails, apply the official codemod**

The interactive upgrade tool is not used here. Instead run the targeted codemod
non-interactively against the reported issue, e.g. async request APIs:
```bash
pnpm dlx @next/codemod@latest next-async-request-api .
```
Re-run `pnpm build`. Repeat with the specific codemod named in the error until
the build is green. Do not make unrelated changes.

- [ ] **Step 6: Smoke-run the dev server**

Run:
```bash
pnpm dev > /tmp/dev16.log 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
kill %1
```
Expected: `200`.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade Next.js 15 -> 16"
```

---

### Task 3: Add @blawness/admin-kit and wire consumption config

**Files:**
- Modify: `package.json` (add dependency `@blawness/admin-kit`, devDependency `tsx`, add `pnpm.onlyBuiltDependencies`)
- Modify: `next.config.mjs` (add `transpilePackages`)

- [ ] **Step 1: Add the dependency and tsx**

In `package.json` add to `dependencies` (keep alphabetical neighborhood):
```json
    "@blawness/admin-kit": "^0.2.0",
```
And add to `devDependencies`:
```json
    "tsx": "^4.22.4",
```

- [ ] **Step 2: Allow the package's build scripts under pnpm**

In `package.json`, under the existing `"pnpm"` object, add an
`onlyBuiltDependencies` array alongside `overrides`:
```json
  "pnpm": {
    "onlyBuiltDependencies": [
      "@blawness/admin-kit",
      "esbuild",
      "sharp"
    ],
    "overrides": {
      "sanity": "4.20.3",
      "@portabletext/editor": "3.2.5",
      "@portabletext/sanity-bridge": "1.2.10",
      "postcss@<8.5.10": "^8.5.10",
      "@sanity/uuid>uuid": "^11.1.1",
      "load-yaml-file>js-yaml": "^3.14.2"
    }
  }
```

- [ ] **Step 3: Enable transpilePackages**

In `next.config.mjs`, add the option inside `nextConfig`:
```js
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,

    // admin-kit ships TS/JSX source that must be transpiled by the consumer
    transpilePackages: ["@blawness/admin-kit"],

    // Image optimization for external domains (if needed)
    images: {
        remotePatterns: [],
    },
};
```

- [ ] **Step 4: Install**

Run:
```bash
pnpm install
```
Expected: exit 0; `@blawness/admin-kit 0.2.0` added; no `ERR_PNPM_*` errors.

- [ ] **Step 5: Verify it resolves**

Run:
```bash
pnpm why @blawness/admin-kit
```
Expected: shows `@blawness/admin-kit 0.2.0` as a direct dependency.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.mjs
git commit -m "build: add @blawness/admin-kit with transpilePackages + pnpm build allowance"
```

---

### Task 4: Prove end-to-end consumption with a throwaway import

**Files:**
- Create (temporary): `app/_smoke-admin-kit/page.tsx`
- Delete (same task): `app/_smoke-admin-kit/page.tsx`

- [ ] **Step 1: Write a temporary page that imports from admin-kit**

Create `app/_smoke-admin-kit/page.tsx`:
```tsx
import { slugify, cn } from "@blawness/admin-kit";

export const dynamic = "force-static";

export default function SmokeAdminKitPage() {
    const sample = slugify("Hello Admin Kit");
    return (
        <pre className={cn("p-4 text-sm")} data-testid="smoke">
            {sample}
        </pre>
    );
}
```

- [ ] **Step 2: Build to confirm the package transpiles and bundles**

Run:
```bash
pnpm build 2>&1 | tee /tmp/smoke-build.log
```
Expected: `✓ Compiled successfully`. The route `/_smoke-admin-kit` appears in the
route table. If the build errors on the import path or on missing Tailwind
tokens, note it — token wiring is deferred to Phase 3, so prefer importing only
pure utilities (`slugify`, `cn`, `sanitizeHtml`) here, which need no styling.

- [ ] **Step 3: Verify the route renders the slug**

Run:
```bash
pnpm dev > /tmp/dev-smoke.log 2>&1 &
sleep 8
curl -s http://localhost:3000/_smoke-admin-kit | grep -o "hello-admin-kit" || echo "NOT FOUND"
kill %1
```
Expected: prints `hello-admin-kit`.

- [ ] **Step 4: Remove the throwaway page**

Run:
```bash
rm -rf app/_smoke-admin-kit
```

- [ ] **Step 5: Rebuild to confirm a clean tree without the smoke route**

Run:
```bash
pnpm build
```
Expected: `✓ Compiled successfully`; `/_smoke-admin-kit` no longer listed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: verify @blawness/admin-kit consumption (throwaway smoke route)"
```

---

### Task 5: Regression-test the existing guest suite on Next 16

**Files:** none (test run only)

- [ ] **Step 1: Run the full Playwright suite**

Run:
```bash
pnpm exec playwright test --reporter=line
```
Expected: `19 passed`. Playwright boots its own dev server.

- [ ] **Step 2: If a spec fails due to Next 16 timing, adjust only the test**

If `articles` detail times out on first cold compile (known dev behavior), the
existing `test.setTimeout(90_000)` should already cover it; if not, bump that
single test's timeout. Do not change product code to satisfy a timing flake.

- [ ] **Step 3: Commit any test-only adjustment (skip if none)**

```bash
git add e2e/
git commit -m "test: stabilize e2e timing on Next 16"
```

---

### Task 6: Phase wrap-up

**Files:**
- Modify: `README.md` (only if the Prerequisites Node/Next note needs updating to Next 16)

- [ ] **Step 1: Update README Next version mention if present**

If `README.md` states a specific Next.js version, change it to "Next.js 16". If
it only says "Next.js", leave it.

- [ ] **Step 2: Final phase verification**

Run:
```bash
pnpm build && pnpm exec playwright test --reporter=line
```
Expected: build `✓ Compiled successfully` and `19 passed`.

- [ ] **Step 3: Commit (skip if README unchanged)**

```bash
git add README.md
git commit -m "docs: note Next.js 16 in README"
```

---

## Self-Review (done by author)

- **Spec coverage:** This plan covers spec §1 (Next 16 upgrade) and §3/§9 setup
  prerequisites (`transpilePackages`, `pnpm.onlyBuiltDependencies`, tsx). DB,
  auth, articles, read layer, media, data migration, and Sanity removal are
  intentionally deferred to Phases 2–9 per the roadmap.
- **Placeholders:** none — every step has concrete commands/code.
- **Consistency:** package name `@blawness/admin-kit`, smoke imports limited to
  pure utilities (`slugify`/`cn`/`sanitizeHtml`) that need no Tailwind tokens,
  matching the deferral of token wiring to Phase 3.
- **Tailwind tokens (`navy`/`brand`/`gold`):** deliberately NOT required in this
  phase because no admin-kit UI component is rendered yet; they land in Phase 3.
```
