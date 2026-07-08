# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vorca Studio's marketing website + blog. Fully bilingual (Indonesian/English) Next.js 16 app with a self-hosted CMS powered by `@blawness/admin-kit`. Deployed on Vercel; Neon Postgres (via Vercel Marketplace) + Cloudflare R2 media.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion · Drizzle ORM · NextAuth v5 (beta) · TanStack Query · pnpm · Node 24 (`engines`; the README's "Node 20" is stale).

## Commands

```bash
pnpm dev                 # dev server (http://localhost:3000)
pnpm build               # production build
pnpm lint                # eslint . (flat config in eslint.config.mjs; `next lint` was removed in Next 16)
pnpm lint:fix            # eslint . --fix

pnpm db:generate         # generate Drizzle migration SQL from db/schema.ts
pnpm db:migrate          # apply migrations
pnpm db:push             # push schema without a migration (dev only)
pnpm db:studio           # Drizzle Studio

ADMIN_PASSWORD=<secret> pnpm seed:admin   # create/update admin user
pnpm seed:client                           # create/update demo client user(s) + sample project(s)
pnpm backfill:covers                       # migrate legacy article covers to R2

pnpm test:e2e                              # Playwright (auto-starts `pnpm dev`, see playwright.config.ts)
pnpm test:e2e -- e2e/articles.spec.ts      # single spec file
pnpm test:e2e -- -g "renders the hero"     # single test by title
pnpm test:e2e:ui                           # Playwright UI mode
```

Drizzle loads env from `.env` then `.env.local` (override). Required env: `DATABASE_URL`, `AUTH_SECRET`, `R2_*` (bucket/public URL/keys/endpoint), `RESEND_API_KEY`. See README for the full table.

## Architecture

### Two surfaces, one app
The app serves a **public marketing site** and an **admin CMS** from the same Next tree. `components/SiteChrome.tsx` (a client component wrapping all routes in `app/layout.tsx`) branches on `pathname`: `/admin/*` gets a bare light-theme canvas (admin-kit ships its own shell + light theme that breaks under the marketing `bg-black/text-white`), everything else gets Header/Footer/WhatsApp button + scroll effects.

### Pages are thin; views hold the UI
Route files under `app/` are minimal server components that set metadata, fetch data, and render a `views/*Page.tsx` component. The `views/` files are the real `"use client"` page implementations (HomePage, ArticlesPage, etc.). When editing page content/UI, edit `views/`, not `app/`.

### Bilingual via LanguageContext
`contexts/LanguageContext.tsx` holds the entire translation dictionary (`id`/`en`) and a `t(key)` lookup, persisted to `localStorage`. Client views call `useLanguage()`. Adding user-facing copy means adding keys to **both** language maps in this file. Provided via `components/providers.tsx` (also wraps TanStack Query's `QueryClientProvider`).

### Data layer & caching
- `db/index.ts`: Drizzle over `postgres-js` with `prepare: false` (required for Neon's pooled connection).
- `db/schema.ts`: **re-exports `media` and `users` from `@blawness/admin-kit/schema`**, and defines the local `articles` table. Migrations live in `db/migrations/`.
- `lib/articles.ts`: public read layer. All queries wrapped in `unstable_cache` with `tags: ["articles"]`, `revalidate: 3600`, and only return `status === "published"` rows. `mapRow` reshapes DB rows into the `Article` type used by views.
- Article mutations (`app/(admin)/admin/(protected)/articles/actions.ts`) are server actions that call `revalidateTag("articles", "max")` after writing, so public pages pick up changes.

### Admin (admin-kit integration)
- Auth middleware is **`proxy.ts`** (Next 16 renamed `middleware` → `proxy`), matching `/admin/:path*`, using `authConfig` from admin-kit.
- Route group `app/(admin)/admin/`: `login/` is public; `(protected)/layout.tsx` calls `requireUser()` and renders admin-kit's `<AdminLayout>` with local `navItems`.
- Media & Users screens are dropped in from `@blawness/admin-kit/screens/*`; Articles is a custom screen (`_components/ArticleForm.tsx` + `actions.ts`) because `articles` is an app-local table.
- `nav-icons.ts` is a `"use client"` re-export of lucide icons so icon *elements* can cross from the server layout into admin-kit's client sidebar (admin-kit types `NavItem.icon` as a ReactNode).
- Working with admin-kit? Use the **`admin-kit` skill** (API reference for the package).

### Client portal
`app/(portal)/portal/` is a separate client-facing surface: `users` with role `client` log in at `/portal/login` and see only their own project(s) (PRD, status, updates, tasks, deliverables; approve/request-revision). `lib/projects.ts` / `lib/portal-auth.ts` / `lib/project-slug.ts` back it; admin manages projects at `/admin/projects`. The admin `(protected)/layout.tsx` redirects `client`-role users to `/portal` if they land on `/admin`.

### Article HTML
User-authored article content is HTML from a Tiptap editor. It's sanitized on write with `sanitizeHtml` (admin-kit) in the server action, and again on render via `lib/article-html.ts` (`sanitize-html` with an explicit tag/attr allowlist; also extracts a TOC).

## Conventions & gotchas
- Path alias `@/*` → repo root.
- `next.config.mjs` derives `images.remotePatterns` dynamically from `R2_PUBLIC_URL`; a new media host must be reachable via that env var. `transpilePackages: ["@blawness/admin-kit"]` is required.
- `app/page.tsx` sets `export const dynamic = 'force-dynamic'`; article list/detail pages use `export const revalidate = 3600`.
- `app/data/articles.json` is legacy pre-migration seed data (bilingual fields), consumed by `scripts/seed-articles.ts` — it is **not** the live data source; the DB is.
- `pnpm.onlyBuiltDependencies` (admin-kit/esbuild/sharp) and `pnpm.overrides` in `package.json` are load-bearing for install — don't strip them.
- Design/migration history lives in `docs/superpowers/` (specs + phased plans for the Sanity→admin-kit migration and homepage revamp).
