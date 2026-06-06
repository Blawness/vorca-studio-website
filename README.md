# Vorca Studio

A disruptive web agency inspired by the Orca (Killer Whale), representing intelligence, power, and precision in digital solutions.

## About

Vorca Studio is a modern web agency that helps businesses dominate the digital landscape through intelligent solutions and collaborative partnerships. Like the Orca that dominates the ocean through sophisticated strategies, we help brands master the digital world.

This repository is the marketing website and blog for Vorca Studio — a fully bilingual (Indonesian / English) Next.js application with an embedded Sanity CMS.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI primitives) + **Framer Motion**
- **Sanity CMS** via `next-sanity`, with the Studio embedded at the `/studio` route
- **TanStack Query** for client-side data fetching and caching
- **Resend** for transactional email from the contact form (`app/api/contact/route.ts`)
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

   | Variable           | Purpose                                                            |
   | ------------------ | ------------------------------------------------------------------ |
   | `SANITY_API_TOKEN` | Write token for importing/updating content (Sanity > API > Tokens) |
   | `RESEND_API_KEY`   | Sends the contact form email via `/api/contact`                    |

4. **Run the dev server**
   ```bash
   pnpm dev
   ```
   The site is available at http://localhost:3000.

## Available Scripts

- `pnpm dev` — start the development server
- `pnpm build` — create a production build
- `pnpm start` — serve the production build
- `pnpm lint` — run Next.js linting
- `pnpm test:e2e` — run the Playwright end-to-end tests
- `pnpm test:e2e:ui` — run the E2E tests in Playwright's UI mode
- `pnpm test:e2e:report` — open the last HTML test report

## End-to-End Tests

Guest-facing flows are covered by Playwright specs in `e2e/`: navigation,
the bilingual language toggle, homepage CTAs, the contact form (validation +
submission), and the blog listing/detail pages.

```bash
pnpm exec playwright install chromium   # one-time browser download
pnpm test:e2e
```

By default Playwright boots its own dev server. To test an already-running
instance (e.g. a preview URL), set `PLAYWRIGHT_BASE_URL`:

```bash
PLAYWRIGHT_BASE_URL=https://your-preview.vercel.app pnpm test:e2e
```

## Sanity CMS

The Sanity Studio is embedded in the app and served at:

```
http://localhost:3000/studio
```

- Schemas live in `sanity/schemas/`.
- Client, queries, and image helpers live in `sanity/lib/`.
- Studio configuration (project id, dataset, base path) is in `sanity.config.ts`.

To bulk-import content into Sanity, use the import script (requires `SANITY_API_TOKEN`):

```bash
pnpm tsx scripts/import-to-sanity.ts
```

## Project Structure

```
vorca-studio-website/
├── app/                      # Next.js App Router routes
│   ├── api/contact/          # Contact form endpoint (Resend)
│   ├── articles/             # Blog listing & detail routes
│   ├── studio/               # Embedded Sanity Studio (/studio)
│   ├── about/  contact/  portfolio/  services/  students/
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles (Tailwind v4)
├── views/                    # Page-level components rendered by routes
├── components/               # Shared components
│   ├── ui/                   # shadcn/ui primitives
│   └── blog/                 # Blog-specific components
├── contexts/                 # React contexts (e.g. LanguageContext)
├── lib/                      # Utilities
├── sanity/                   # Sanity client, queries, schemas
│   ├── lib/
│   └── schemas/
├── scripts/import-to-sanity.ts
├── sanity.config.ts          # Sanity Studio config
└── vercel.json               # Vercel build/install commands
```

## Internationalization

The site is fully bilingual:

- **Indonesian (id)** — default language
- **English (en)** — secondary language

Language state is managed by `contexts/LanguageContext.tsx`, with switching available in the header.

## Contact Form

The contact form posts to `app/api/contact/route.ts`, which sends an email notification through the Resend API. Both the client and the API route validate input.

## Design System

### Colors
- **Primary**: Cyan (#06b6d4) and Blue (#2563eb)
- **Background**: Black (#000000) and gray variations
- **Text**: White and gray variations

### Typography
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable fonts
- **Accent**: Cyan highlights

### Components
- **Cards**: Gradient backgrounds with hover effects
- **Buttons**: Gradient primary buttons with shadows
- **Animations**: Smooth transitions with Framer Motion

## Deployment

The site is deployed on **Vercel**. Build and install commands are defined in `vercel.json`:

```json
{
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm run build"
}
```

Set `SANITY_API_TOKEN` and `RESEND_API_KEY` in the Vercel project's environment variables before deploying.

## License

This project is proprietary software. All rights reserved.

---

**Vorca Studio** — Smart. Sleek. Deep Impact.
