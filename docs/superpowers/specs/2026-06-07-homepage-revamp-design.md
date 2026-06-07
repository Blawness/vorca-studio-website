# Homepage Revamp Design Spec

**Date:** 2026-06-07
**Status:** Approved
**Reference:** `public/references/ChatGPT Image Jun 7, 2026, 04_13_11 PM.png`

## Overview

Full replacement of the Vorca Studio homepage to match the reference image layout — a clean, business-focused design with a dark theme, blue accents, and structured sections. Bilingual support (ID/EN) is maintained via new translation keys.

## Approach

**Approach B: Reference + Enhanced Depth**
- Match reference layout closely with subtle scroll animations and hover effects
- Connected timeline for Proses section
- Tech stack uses logo cards with icons
- Portfolio section includes filter tabs

## Sections

### 1. Navigation
- Keep current nav items: Beranda, Layanan, Portfolio, Tentang, Untuk Mahasiswa, Artikel, Kontak
- Dark background (`bg-black/80`) with backdrop blur, border-bottom
- Active item highlighted with blue underline dot
- Right side: "DM @vorcastudio" outlined button (matching reference style)
- Mobile: hamburger menu (unchanged from current)

### 2. Hero
- Two-column layout: text left, laptop mockup right
- Blue label: "WEB DEVELOPMENT STUDIO"
- Headline: "Membangun Web, Menggerakkan **Bisnis** Anda." (Bisnis in blue)
- Subtitle about helping Indonesian businesses go digital
- 3 feature pills with icons:
  - Performa Cepat & Optimal
  - Desain Modern & Responsif
  - Aman, Stabil & Terpercaya
- CTA button: "DM @vorcastudio untuk konsultasi →"
- Right side: laptop mockup placeholder (user will replace with actual screenshot later) showing a dashboard preview with blue theme
- Background: dark with subtle blue glow effects

### 3. Layanan Kami
- Blue label: "LAYANAN KAMI"
- Headline: "Solusi Digital yang Sesuai Kebutuhan Anda"
- Description text on the right side
- 3 cards in a row:
  - **Landing Page** — Halaman landing yang dirancang untuk konversi tinggi dan kampanye yang efektif.
  - **Company Profile** — Website company profile yang membangun kredibilitas dan meningkatkan kepercayaan.
  - **Custom Web App** — Aplikasi web custom yang disesuaikan dengan proses bisnis dan kebutuhan Anda.
- Each card: blue icon square, title, description, arrow icon bottom-right
- Dark cards with subtle borders, hover lift animation

### 4. Proses Kerja
- Blue label: "PROSES KERJA"
- Headline: "Proses Jelas, Hasil Berkualitas"
- Horizontal timeline with 4 numbered steps connected by a blue line with dots:
  - **01 Diskusi** — Kita bahas kebutuhan, tujuan, dan solusi terbaik untuk project Anda.
  - **02 Perancangan** — Wireframe & UI/UX dirancang untuk pengalaman terbaik.
  - **03 Pengembangan** — Website dibangun dengan kode yang clean, cepat, dan scalable.
  - **04 Testing & Launch** — Pengujian menyeluruh sebelum website siap digunakan.
- Each step: blue number, title, description
- Responsive: stacks vertically on mobile

### 5. Teknologi Kami
- Blue label: "TEKNOLOGI KAMI"
- Headline: "Modern Tech Stack Untuk Hasil Terbaik"
- Logo row with 5 items in dark cards:
  - Next.js — React Framework
  - TypeScript — Type Safety
  - Tailwind CSS — Utility First CSS
  - Vercel — Deployment
  - Supabase — Database (Opsional)
- Each logo card: icon/logo + name + short label
- Hover effect on each card

### 6. Portfolio Preview
- Blue label: "PORTFOLIO KAMI"
- Headline: "Karya Terbaru Kami"
- Grid of 3 project cards with:
  - Thumbnail image placeholder
  - Project title and category tag
  - Hover overlay with "Lihat Detail" button
- "Lihat Semua Portfolio →" button below

### 7. CTA Final
- Dark section with subtle blue gradient glow
- Headline: "Siap Membawa Bisnis Anda ke Level Berikutnya?"
- Subtitle: "Konsultasi gratis, tanpa komitmen. Ceritakan kebutuhan Anda dan kami bantu rancang solusi digital yang tepat."
- CTA button: "DM @vorcastudio untuk konsultasi →" (blue, prominent)
- Clean, centered layout

## Translation Keys (New)

All new keys added to both `id` and `en` in `LanguageContext.tsx`:

| Key | ID | EN |
|-----|-----|-----|
| `hero.label` | WEB DEVELOPMENT STUDIO | WEB DEVELOPMENT STUDIO |
| `hero.headline` | Membangun Web, Menggerakkan Bisnis Anda. | Building Websites, Driving Your Business. |
| `hero.subtitle` | Vorca Studio membantu bisnis dan startup di Indonesia hadir secara digital dengan website yang modern, cepat, dan berdampak. | Vorca Studio helps businesses and startups in Indonesia establish a digital presence with modern, fast, and impactful websites. |
| `hero.feature1` | Performa Cepat & Optimal | Fast & Optimal Performance |
| `hero.feature2` | Desain Modern & Responsif | Modern & Responsive Design |
| `hero.feature3` | Aman, Stabil & Terpercaya | Secure, Stable & Reliable |
| `hero.cta.dm` | DM @vorcastudio untuk konsultasi | DM @vorcastudio for consultation |
| `services.label` | LAYANAN KAMI | OUR SERVICES |
| `services.headline` | Solusi Digital yang Sesuai Kebutuhan Anda | Digital Solutions Tailored to Your Needs |
| `services.description` | Kami fokus pada 3 layanan utama untuk membantu bisnis Anda tampil profesional dan berkembang di dunia digital. | We focus on 3 core services to help your business look professional and grow in the digital world. |
| `services.landing.title` | Landing Page | Landing Page |
| `services.landing.desc` | Halaman landing yang dirancang untuk konversi tinggi dan kampanye yang efektif. | Landing pages designed for high conversion and effective campaigns. |
| `services.company.title` | Company Profile | Company Profile |
| `services.company.desc` | Website company profile yang membangun kredibilitas dan meningkatkan kepercayaan. | Company profile websites that build credibility and increase trust. |
| `services.webapp.title` | Custom Web App | Custom Web App |
| `services.webapp.desc` | Aplikasi web custom yang disesuaikan dengan proses bisnis dan kebutuhan Anda. | Custom web applications tailored to your business processes and needs. |
| `process.label` | PROSES KERJA | OUR PROCESS |
| `process.headline` | Proses Jelas, Hasil Berkualitas | Clear Process, Quality Results |
| `process.step1.title` | Diskusi | Discussion |
| `process.step1.desc` | Kita bahas kebutuhan, tujuan, dan solusi terbaik untuk project Anda. | We discuss your needs, goals, and the best solution for your project. |
| `process.step2.title` | Perancangan | Design |
| `process.step2.desc` | Wireframe & UI/UX dirancang untuk pengalaman terbaik. | Wireframes & UI/UX designed for the best experience. |
| `process.step3.title` | Pengembangan | Development |
| `process.step3.desc` | Website dibangun dengan kode yang clean, cepat, dan scalable. | Website built with clean, fast, and scalable code. |
| `process.step4.title` | Testing & Launch | Testing & Launch |
| `process.step4.desc` | Pengujian menyeluruh sebelum website siap digunakan. | Thorough testing before the website is ready to use. |
| `tech.label` | TEKNOLOGI KAMI | OUR TECHNOLOGY |
| `tech.headline` | Modern Tech Stack Untuk Hasil Terbaik | Modern Tech Stack For Best Results |
| `tech.nextjs.label` | React Framework | React Framework |
| `tech.typescript.label` | Type Safety | Type Safety |
| `tech.tailwind.label` | Utility First CSS | Utility First CSS |
| `tech.vercel.label` | Deployment | Deployment |
| `tech.supabase.label` | Database (Opsional) | Database (Optional) |
| `portfolio.label` | PORTFOLIO KAMI | OUR PORTFOLIO |
| `portfolio.headline` | Karya Terbaru Kami | Our Latest Work |
| `portfolio.viewAll` | Lihat Semua Portfolio | View All Portfolio |
| `portfolio.viewDetail` | Lihat Detail | View Details |
| `cta.headline` | Siap Membawa Bisnis Anda ke Level Berikutnya? | Ready to Take Your Business to the Next Level? |
| `cta.description` | Konsultasi gratis, tanpa komitmen. Ceritakan kebutuhan Anda dan kami bantu rancang solusi digital yang tepat. | Free consultation, no commitment. Tell us your needs and we'll help design the right digital solution. |

## Files to Modify

1. `views/HomePage.tsx` — Complete rewrite with new sections
2. `contexts/LanguageContext.tsx` — Add new translation keys
3. `components/Header.tsx` — Minor style tweak for DM button on right side (optional, can be done in HomePage only)

## Files to Create

1. `public/images/laptop-mockup-placeholder.png` — Placeholder for laptop mockup (user will replace)

## Design Tokens

- Background: `#050b16` (dark navy/black)
- Primary accent: `#06b6d4` (cyan/blue)
- Card background: `rgba(15, 23, 42, 0.6)` with border `rgba(100, 116, 139, 0.2)`
- Text primary: white
- Text secondary: `#94a3b8` (gray-400)
- Blue accent for highlights: `#3b82f6` (blue-500)

## Animations

- Fade-in on scroll for all sections (framer-motion `whileInView`)
- Hover lift on service cards and tech cards (`-translate-y-1`)
- Timeline dots pulse animation
- Staggered entrance for cards (delay per index)
