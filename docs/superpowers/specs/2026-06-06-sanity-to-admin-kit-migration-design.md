# Migrasi CMS: Sanity → @blawness/admin-kit

- **Tanggal:** 2026-06-06
- **Status:** Disetujui (desain) — siap untuk implementation plan
- **Pendekatan:** A — admin-kit sebagai fondasi, fitur artikel dimiliki app

## 1. Tujuan & Konteks

Mengganti CMS proyek `vorca-studio-website` dari **Sanity** (hosted, GROQ,
konten Markdown, Studio embedded di `/studio`) menjadi **`@blawness/admin-kit`**
— CMS core self-hosted milik sendiri (Postgres + Drizzle, NextAuth v5, editor
Tiptap, media Cloudflare R2, admin shell).

Saat ini hanya **artikel/blog** yang CMS-backed. `PortfolioPage` memakai data
statis (string "Sanity CMS" hanyalah tag, bukan integrasi). Jadi cakupan CMS =
fitur artikel saja.

### Keputusan yang sudah disepakati

| Topik | Keputusan |
| --- | --- |
| Cakupan | **Admin panel penuh** (auth + media + users + shell + editor artikel) |
| Database | **Neon Postgres** via Vercel Marketplace (`DATABASE_URL`) |
| Media | **Cloudflare R2** (env `R2_*`, klien S3-compatible) |
| Versi Next.js | **Upgrade Next 15 → 16** + React → 19.2 (peer dep admin-kit) |
| Migrasi data | **Otomatis**: 15 artikel Sanity → konversi Markdown→HTML → Postgres |
| Format konten | **HTML tersanitasi** (Tiptap), bukan Markdown |
| Penghapusan Sanity | **Di fase akhir**, setelah artikel jalan dari Postgres |

## 2. Tentang @blawness/admin-kit (v0.2.0)

- **Stack:** drizzle-orm + `postgres`, next-auth ^5 (beta), Tiptap ^3,
  @aws-sdk/client-s3 (R2), sharp, zod, base-ui, sonner.
- **Peer deps:** `next ^16.2`, `react ^19.2`, `react-dom ^19.2`, `tailwindcss ^4`.
- **Schema bawaan:** hanya tabel `users` dan `media`. **Tidak ada model
  `articles`/`posts`** — harus dibangun consumer.
- **Exports utama:** `db`, `schema` (users, media), `auth`, `auth/config`,
  `auth-helpers`, `admin/media`, `admin/users`, `screens/{login,media,users}`
  (+ `actions`/`lib`), `shell`, `shell/sidebar`, `components`; util `cn`,
  `slugify`, `sanitizeHtml`, `r2` (`uploadImage`, `deleteObjectByUrl`,
  `R2_BUCKET`, `R2_PUBLIC_URL`).
- **Gotchas konsumsi:** butuh `transpilePackages: ["@blawness/admin-kit"]`;
  Tailwind harus scan paket + mendefinisikan token `navy`/`brand`/`gold`.

## 3. Arsitektur Target

```
app/
  (site)/                # publik (existing): /, /services, /articles, ...
  (admin)/
    admin/
      layout.tsx         # admin-kit shell + sidebar + guard auth
      page.tsx           # dashboard ringkas
      login/page.tsx     # admin-kit screens/login
      media/page.tsx     # admin-kit screens/media
      users/page.tsx     # admin-kit screens/users
      articles/          # FITUR BARU (dibangun app)
        page.tsx         # list artikel
        new/page.tsx     # create (editor Tiptap)
        [id]/page.tsx    # edit
        actions.ts       # server actions: create/update/delete/publish
  api/auth/[...nextauth]/route.ts   # NextAuth v5 handler
db/
  index.ts               # re-export db client admin-kit (atau init dgn DATABASE_URL)
  schema.ts              # re-export users/media + tabel `articles` milik app
  migrations/            # output drizzle-kit
lib/
  articles.ts            # layer baca publik (Drizzle) — pengganti sanity/lib/fetch
drizzle.config.ts
scripts/
  seed-admin.ts          # buat user admin pertama
  migrate-from-sanity.ts # one-shot: Sanity → Postgres (Markdown→HTML)
```

Auth memproteksi seluruh route group `(admin)` kecuali `/admin/login`.

## 4. Data Model

Tabel `articles` (Drizzle, Postgres) — mempertahankan field setara skema Sanity
agar `views/Articles*` minim berubah:

| Kolom | Tipe | Catatan |
| --- | --- | --- |
| `id` | serial PK | |
| `title` | text not null | |
| `slug` | text not null **unique** | dari `slugify` |
| `excerpt` | text not null | |
| `content` | text not null | **HTML tersanitasi** (Tiptap) |
| `coverImageUrl` | text | URL R2 atau eksternal |
| `category` | text not null | enum lama dipertahankan via zod |
| `author` | text not null | |
| `publishedAt` | timestamp | tanggal publish |
| `readTime` | integer not null | menit |
| `tags` | text[] | |
| `status` | text not null default `'draft'` | `draft` \| `published` |
| `createdAt` / `updatedAt` | timestamp default now | |

Interface publik `Article` (di `lib/articles.ts`) tetap selaras dengan bentuk
lama (`id, slug, title, excerpt, content?, image, category, author, date,
readTime, tags`) — `image` dipetakan dari `coverImageUrl`, `date` dari
`publishedAt` — sehingga komponen view tidak perlu refaktor besar.

### Format konten (konsekuensi)

Konten menjadi **HTML**. Parser Markdown bespoke di `components/blog/ArticleBody.tsx`
diganti menjadi render HTML tersanitasi (`sanitizeHtml` + `dangerouslySetInnerHTML`),
dan TOC dibangun dengan mem-parse elemen heading (`<h2>/<h3>`) dari HTML.
**Trade-off diterima:** shortcode khusus lama (`Callout`, `PullQuote`,
`TestingToolsGrid`) tidak terbawa otomatis saat migrasi; konten itu menjadi HTML
biasa dan bisa direstorasi manual bila diperlukan (di luar cakupan migrasi ini).

## 5. Area Admin

- **Auth:** konfigurasi NextAuth v5 dari `@blawness/admin-kit/auth/config`;
  handler di `app/api/auth/[...nextauth]/route.ts`; helper proteksi dari
  `admin-kit/auth-helpers` pada `(admin)/layout.tsx`. Login pakai tabel `users`;
  `scripts/seed-admin.ts` membuat admin pertama (email + bcrypt hash).
- **Shell:** `@blawness/admin-kit/shell` + `shell/sidebar` membungkus area admin;
  sidebar ditambah entri "Artikel".
- **Screen bawaan:** mount `screens/login`, `screens/media`, `screens/users`
  (+ actions) langsung dari paket.
- **Screen Artikel (baru, milik app):** list dengan status & aksi; form
  create/edit dengan editor Tiptap (memakai dependensi Tiptap dari admin-kit),
  upload cover ke R2, validasi zod, `slugify` + `sanitizeHtml` dari paket;
  server actions untuk create/update/delete/publish + revalidasi tag/route ISR
  publik.

## 6. Layer Baca & Render Publik

- `lib/articles.ts` menggantikan `sanity/lib/fetch.ts`: `getAllArticles()`,
  `getArticleBySlug(slug)`, `getAllSlugs()` — hanya artikel `status='published'`,
  urut `publishedAt desc`, via Drizzle.
- `app/articles/page.tsx` dan `app/articles/[slug]/page.tsx`: `force-dynamic`
  → **ISR** (`export const revalidate = ...`), di-`revalidate` dari admin saat
  publish/update. `generateStaticParams` tetap memakai slugs dari DB.
- `components/blog/ArticleBody.tsx`: render HTML tersanitasi + bangun TOC dari
  heading HTML. `ArticleDetailPage`/`ArticleTOC` menyesuaikan sumber heading.

## 7. Media (Cloudflare R2)

- Env: `R2_BUCKET`, `R2_PUBLIC_URL`, kredensial S3 (sesuai yang dibaca
  `admin-kit/r2`). Upload via `uploadImage`, hapus via `deleteObjectByUrl`.
- `next.config` `images.remotePatterns` diisi host `R2_PUBLIC_URL` agar
  `next/image` boleh memuat gambar artikel.

## 8. Migrasi Data (one-shot)

`scripts/migrate-from-sanity.ts`:
1. Fetch 15 artikel dari Sanity (pakai client read-only lama, sementara masih ada).
2. Konversi `content` Markdown → HTML (mis. `marked`/remark) lalu `sanitizeHtml`.
3. Map field → insert ke tabel `articles` (status `published`, `publishedAt` dari
   `date`).
4. Gambar: simpan `image` URL lama apa adanya ke `coverImageUrl` (opsi salin ke
   R2 menyusul; tidak memblok).

Idempoten by slug (skip/update bila sudah ada).

## 9. Infra & Environment

`.env.example` (baru):
```
DATABASE_URL=        # Neon Postgres
AUTH_SECRET=         # NextAuth v5
R2_BUCKET=
R2_PUBLIC_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=         # (sesuai yang dibutuhkan admin-kit/r2)
RESEND_API_KEY=      # tetap (form kontak)
```
- Provisioning Neon via Vercel Marketplace. Drizzle migrate dijalankan saat
  setup lokal & sebagai langkah deploy. `pnpm.onlyBuiltDependencies` +
  `transpilePackages` ditambah. README diperbarui menyeluruh.

## 10. Penghapusan Sanity (fase akhir)

Setelah artikel jalan dari Postgres & terverifikasi:
- Hapus `sanity/`, `sanity.config.ts`, `app/studio/`, `scripts/import-to-sanity.ts`.
- Hapus dependensi `next-sanity`, `@sanity/client`, `@sanity/image-url`, dan
  override pin `sanity`/`@portabletext/*` di `package.json`.
- Hapus referensi Sanity tersisa (mis. di E2E) & `pnpm audit` ulang.

## 11. Testing

- E2E guest existing tetap valid (URL & UI publik tidak berubah).
- `e2e/articles.spec.ts`: kini mengandalkan data Postgres — sediakan seed data
  test (script atau fixture) agar deterministik; longgarkan jika kosong.
- Opsional: smoke test login admin (form login render + proteksi route).
- Verifikasi akhir: `pnpm build` hijau, `pnpm test:e2e` hijau, `pnpm audit` bersih.

## 12. Urutan Fase (sequencing)

1. **Upgrade Next 16** + React 19.2; pasang admin-kit; `transpilePackages` +
   Tailwind token; build hijau.
2. **DB**: drizzle-kit, `db/schema.ts` (+ articles), `DATABASE_URL`, migrate.
3. **Auth + shell + screens** admin-kit (login/media/users); seed admin.
4. **Screen Artikel** (CRUD + editor Tiptap + upload R2).
5. **Layer baca publik** (`lib/articles.ts`) + render HTML + ISR.
6. **Migrasi data** Sanity → Postgres.
7. **R2 media** finalisasi (remotePatterns, upload cover).
8. **Hapus Sanity** + bersihkan deps/override.
9. **Update E2E** + verifikasi penuh.

## 13. Risiko & Mitigasi

- **Next 16 upgrade** dapat memunculkan breaking change → jalankan codemod resmi,
  build + E2E sebagai gate sebelum lanjut.
- **next-auth v5 beta** → API bisa berubah; ikuti versi yang dipin admin-kit.
- **Kehilangan shortcode konten** → diterima; dokumentasikan, restorasi manual.
- **admin-kit baru (v0.2.0, 1 versi)** → permukaan kecil; bila ada bug paket,
  fallback salin pola (Pendekatan B) untuk bagian terdampak saja.
- **Konsumsi paket (pnpm)** → set `onlyBuiltDependencies`/`transpilePackages`
  lebih awal untuk hindari error build.

## 14. Di Luar Cakupan

- Memindahkan Portfolio ke CMS (tetap statis).
- Mereplikasi shortcode `Callout`/`PullQuote`/`TestingToolsGrid` sebagai node Tiptap.
- Multi-bahasa konten artikel (tetap seperti sekarang).
- Migrasi gambar lama ke R2 (boleh menyusul; URL eksternal tetap jalan).
