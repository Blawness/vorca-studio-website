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
- `pnpm seed:client` — create/update demo client users + sample projects for the portal
- `pnpm backfill:covers` — migrate article cover images from Sanity CDN to R2
- `pnpm test:e2e` — run Playwright end-to-end tests
- `pnpm test:e2e:ui` — run E2E tests in Playwright UI mode
- `pnpm test:e2e:report` — open the last HTML test report

## Admin Panel

The CMS admin area is at `/admin`. Login with the credentials created by `pnpm seed:admin`.

- **Dashboard** — overview
- **Artikel** — create/edit/publish/delete blog articles (Tiptap rich text editor, R2 cover upload)
- **Media** — upload and manage media files
- **Users** — manage admin/editor users
- **Projects** — manage client projects (PRD, status, updates, tasks, deliverables); assign a project to a `client`-role user

## Client Portal

Clients log in at `/portal/login` to view their project's PRD, status, updates, tasks, and deliverables, and to approve or request revisions on deliverables.

- Create a client account via the admin **Users** screen with role `client`, then assign them to a project in **Projects**.
- For a quick demo, run `pnpm seed:client` to create demo client accounts (`CLIENT_EMAIL`/`CLIENT_PASSWORD` env vars optional) with sample projects.
- No new environment variables are required — the portal reuses the existing DB and auth setup.

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
│   │   ├── projects/        # Client project CRUD
│   │   └── login/           # Login screen
│   ├── (portal)/portal/     # Client project portal (auth-protected)
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
│   └── backfill-covers-to-r2.ts  # Migrate cover images to R2
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
