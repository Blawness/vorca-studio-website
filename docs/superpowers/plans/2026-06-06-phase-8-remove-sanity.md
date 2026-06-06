# Phase 8 — Remove Sanity + Clean Dependencies (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely remove Sanity from the project — delete `sanity/`, `sanity.config.ts`, `app/studio/`, `scripts/import-to-sanity.ts`, uninstall Sanity npm packages, remove the version pin overrides for Sanity/portabletext, and update `.env.example` + README. After this phase, `pnpm audit` should be clean and the build should have zero Sanity imports.

**Architecture:** Pure deletion phase. No new files, no new behavior. The public site now reads from Postgres (Phase 5–6) and cover images are on R2 (Phase 7). The Sanity client, Studio, and GROQ queries are dead code.

**Prerequisites:** Phase 7 complete. All 15 articles migrated and cover images on R2. Public site verified end-to-end from Postgres. `pnpm build` and `19 passed` E2E on the Phase 7 branch.

---

## Migration Roadmap (this plan = Phase 8)

1–7. ✓  8. **Phase 8 — Remove Sanity** ← this document
9. Phase 9 — Update E2E + full verification

---

## Pre-flight

Phase 7 complete. Working tree clean. Cover images confirmed on R2. `cdn.sanity.io` removed from `remotePatterns` (Phase 7, Task 3, Step 4).

---

### Task 1: Create working branch

```bash
git switch -c phase-8-remove-sanity
```

---

### Task 2: Delete Sanity source files

**Files to delete:**
- `sanity/` (entire directory)
- `sanity.config.ts`
- `app/studio/` (the embedded Studio route)
- `scripts/import-to-sanity.ts`

- [ ] **Step 1: Confirm no remaining imports before deleting**

```bash
grep -rn "from.*sanity\|require.*sanity\|@sanity\|next-sanity" \
    app/ lib/ views/ components/ contexts/ scripts/ \
    --include="*.ts" --include="*.tsx" \
    | grep -v "migrate-from-sanity\|backfill-covers" \
    | grep -v "node_modules"
```

Investigate every result. The only acceptable remaining references are:
- `scripts/migrate-from-sanity.ts` (kept for history, but no longer needs to run)
- `scripts/backfill-covers-to-r2.ts` (uses `@blawness/admin-kit` not Sanity, so safe)

If any `app/`, `lib/`, `views/`, or `components/` file still imports from Sanity, fix it before proceeding — it means Phase 5 did not fully replace a fetch call.

- [ ] **Step 2: Delete Sanity files**

```bash
rm -rf sanity/ sanity.config.ts app/studio/ scripts/import-to-sanity.ts
```

- [ ] **Step 3: Verify deletion**

```bash
ls sanity.config.ts 2>&1 || echo "deleted OK"
ls -la sanity/ 2>&1 || echo "deleted OK"
ls -la app/studio/ 2>&1 || echo "deleted OK"
```

---

### Task 3: Uninstall Sanity npm packages

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: List all Sanity-related direct deps**

```bash
node -e "
const pkg = JSON.parse(require('fs').readFileSync('package.json','utf8'));
const all = {...(pkg.dependencies||{}), ...(pkg.devDependencies||{})};
Object.keys(all).filter(k => k.includes('sanity') || k.includes('portabletext')).forEach(k => console.log(k));
"
```

Expected output (will include some or all of):
- `next-sanity`
- `@sanity/client`
- `@sanity/image-url`
- `@sanity/vision` (if present)
- `sanity` (if listed as direct dep)

- [ ] **Step 2: Uninstall them**

```bash
pnpm remove next-sanity @sanity/client @sanity/image-url
```

Add any additional packages from Step 1 to the remove command. If `sanity` itself is a direct dep, remove it too.

- [ ] **Step 3: Verify they are gone**

```bash
pnpm why next-sanity 2>&1 | head -3
pnpm why @sanity/client 2>&1 | head -3
```

Expected: `ERR_PNPM_NO_MATCHING_VERSION` or similar "not found" message.

---

### Task 4: Remove Sanity overrides from package.json

**Files:** `package.json`

These `pnpm.overrides` were added to pin Sanity v4 peer deps to a compatible combination. They are no longer needed.

- [ ] **Step 1: Remove the Sanity pin overrides**

In `package.json`, find the `"pnpm"."overrides"` object and remove these entries:
```json
"sanity": "4.20.3",
"@portabletext/editor": "3.2.5",
"@portabletext/sanity-bridge": "1.2.10",
```

Also check if `"@sanity/uuid>uuid"` and `"load-yaml-file>js-yaml"` were Sanity-related overrides and remove them too if they were only needed for Sanity:
```json
"@sanity/uuid>uuid": "^11.1.1",
"load-yaml-file>js-yaml": "^3.14.2"
```

What should remain after cleanup:
```json
"pnpm": {
    "onlyBuiltDependencies": ["@blawness/admin-kit", "esbuild", "sharp"],
    "overrides": {
        "postcss@<8.5.10": "^8.5.10"
    }
}
```

(Keep the `postcss` override; it was a security audit fix unrelated to Sanity.)

- [ ] **Step 2: Re-install to regenerate lockfile**

```bash
pnpm install
```

Expected: exit 0; `pnpm-lock.yaml` updated with Sanity packages removed.

---

### Task 5: Remove SANITY_API_TOKEN from environment files

**Files:** `.env.example`

- [ ] **Step 1: Update `.env.example`**

Remove the `SANITY_API_TOKEN` line. The final `.env.example` should be:

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
```

---

### Task 6: Update README

**Files:** `README.md`

- [ ] **Step 1: Rewrite README to reflect the new stack**

Key changes:
- Replace "Next.js 15" with "Next.js 16"
- Replace "Sanity CMS" references with "@blawness/admin-kit (self-hosted CMS)"
- Update the Tech Stack section
- Update the "Getting Started" environment variables table
- Remove the "Sanity CMS" section entirely
- Add an "Admin Panel" section describing `/admin` login and seed script
- Update the Project Structure tree (remove `sanity/`, `app/studio/`, add `db/`, `app/(admin)/`)

Here is the full replacement content:

```markdown
# Vorca Studio

A disruptive web agency inspired by the Orca (Killer Whale), representing intelligence, power, and precision in digital solutions.

## About

Vorca Studio is a modern web agency that helps businesses dominate the digital landscape through intelligent solutions and collaborative partnerships.

This repository is the marketing website and blog for Vorca Studio — a fully bilingual (Indonesian / English) Next.js application with a self-hosted CMS powered by `@blawness/admin-kit`.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI primitives) + **Framer Motion**
- **@blawness/admin-kit** — self-hosted CMS (Postgres + Drizzle ORM, NextAuth v5, Tiptap editor, Cloudflare R2 media)
- **Neon Serverless Postgres** via Vercel Marketplace
- **Cloudflare R2** for media storage
- **TanStack Query** for client-side data fetching
- **Resend** for transactional email from the contact form
- **pnpm** as the package manager
- Deployed on **Vercel**

## Prerequisites

- **Node.js 20** (see `engines` in `package.json`)
- **pnpm** (`npm i -g pnpm`, or enable via `corepack`)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vorca-studio-website
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy the example file and fill in the values:
   ```bash
   cp .env.example .env.local
   ```

   | Variable | Purpose |
   |---|---|
   | `DATABASE_URL` | Neon Postgres connection string |
   | `AUTH_SECRET` | Random 32-byte secret for NextAuth v5 (`openssl rand -base64 32`) |
   | `R2_BUCKET` | Cloudflare R2 bucket name |
   | `R2_PUBLIC_URL` | Public base URL of the R2 bucket |
   | `R2_ACCESS_KEY_ID` | R2 access key |
   | `R2_SECRET_ACCESS_KEY` | R2 secret key |
   | `R2_ENDPOINT` | R2 endpoint URL |
   | `RESEND_API_KEY` | Sends the contact form email |

4. **Run DB migrations**
   ```bash
   pnpm db:migrate
   ```

5. **Seed the admin user**
   ```bash
   ADMIN_PASSWORD=<secret> pnpm seed:admin
   ```

6. **Run the dev server**
   ```bash
   pnpm dev
   ```
   The site is available at http://localhost:3000.

## Available Scripts

- `pnpm dev` — start the development server
- `pnpm build` — create a production build
- `pnpm start` — serve the production build
- `pnpm lint` — run Next.js linting
- `pnpm db:generate` — generate Drizzle migration SQL
- `pnpm db:migrate` — apply migrations to the DB
- `pnpm db:studio` — open Drizzle Studio
- `pnpm seed:admin` — create/update the admin user
- `pnpm test:e2e` — run Playwright end-to-end tests
- `pnpm test:e2e:ui` — run E2E tests in Playwright UI mode
- `pnpm test:e2e:report` — open the last HTML test report

## Admin Panel

The CMS admin area is at `/admin`. Login with the credentials created by `pnpm seed:admin`.

- **Dashboard** — overview
- **Artikel** — create/edit/publish/delete blog articles (Tiptap rich text editor, R2 cover upload)
- **Media** — upload and manage media files
- **Users** — manage admin/editor users

## End-to-End Tests

```bash
pnpm exec playwright install chromium   # one-time browser download
pnpm test:e2e
```

## Project Structure

```
vorca-studio-website/
├── app/
│   ├── (admin)/admin/       # Admin area (auth-protected)
│   │   ├── layout.tsx       # Shell + sidebar
│   │   ├── articles/        # Article CRUD
│   │   ├── media/           # Media library
│   │   ├── users/           # User management
│   │   └── login/           # Login screen
│   ├── api/
│   │   ├── auth/            # NextAuth v5 handler
│   │   └── contact/         # Contact form (Resend)
│   ├── articles/            # Public blog listing + detail
│   └── [other routes]/
├── db/
│   ├── index.ts             # Drizzle client
│   ├── schema.ts            # users + media + articles tables
│   └── migrations/          # Generated SQL migrations
├── lib/
│   └── articles.ts          # Public read layer (Drizzle)
├── views/                   # Page-level components
├── components/              # Shared components
├── scripts/
│   ├── seed-admin.ts        # Create first admin user
│   └── migrate-from-sanity.ts  # One-shot historical migration
├── drizzle.config.ts
└── vercel.json
```

## Internationalization

Fully bilingual: Indonesian (default) and English. Language state managed by `contexts/LanguageContext.tsx`.

## Design System

- **Primary**: Cyan (#06b6d4) and Blue (#2563eb)
- **Background**: Black (#000000) and gray
- **Text**: White and gray variations

## Deployment

Deployed on **Vercel**. Build commands in `vercel.json`. Set all env vars from `.env.example` in Vercel project settings. Run `pnpm db:migrate` as a build step or manually after provisioning Neon.

## License

Proprietary. All rights reserved.

---

**Vorca Studio** — Smart. Sleek. Deep Impact.
```

---

### Task 7: Run pnpm audit

- [ ] **Step 1: Audit**

```bash
pnpm audit
```

Expected: `found 0 vulnerabilities`. If any moderate+ severity found, fix them:
```bash
pnpm audit --fix
```
Then re-check.

---

### Task 8: Final build + E2E gate

- [ ] **Step 1: Build**

```bash
pnpm build 2>&1 | tee /tmp/phase8-build.log
```

Expected: `✓ Compiled successfully` with zero Sanity-related errors or warnings.

- [ ] **Step 2: Confirm no Sanity imports in build output**

```bash
grep -i sanity /tmp/phase8-build.log || echo "clean"
```

Expected: `clean`.

- [ ] **Step 3: E2E**

```bash
pnpm exec playwright test --reporter=line
```

Expected: `19 passed`.

---

### Task 9: Commit

```bash
git add -A
git commit -m "chore: remove Sanity CMS + clean deps + update README (Phase 8)"
```

---

## Self-Review

- **Spec coverage:** §10 (delete `sanity/`, `sanity.config.ts`, `app/studio/`, `scripts/import-to-sanity.ts`; remove deps; remove overrides; audit clean).
- **Pre-deletion grep check:** critical step — ensures no live import would break after deletion.
- **`postcss` override kept:** unrelated security fix from Phase 0; not a Sanity artifact.
- **README fully rewritten:** reflects the actual new stack. Old Sanity section removed.
- **`migrate-from-sanity.ts` kept in `scripts/`:** it's a historical artifact and causes no harm; it would error at runtime (Sanity client not installed) but is not imported anywhere. Can be deleted in a follow-up cleanup if desired.
