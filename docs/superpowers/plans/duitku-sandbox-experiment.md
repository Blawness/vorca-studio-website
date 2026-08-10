# Plan: Eksperimen Sandbox Payment Gateway Duitku

Status: **Phase 0 + Phase 1 selesai** (callback endpoint, signature helper, persistensi DB).
Phase 2+ (create transaction) belum dikerjakan.

## 1. Ringkasan dokumentasi Duitku (sumber: docs.duitku.com/api)

Base URL:
- Sandbox: `https://sandbox.duitku.com/webapi`
- Production: `https://passport.duitku.com/webapi`

Semua signature memakai **HMAC-SHA256 hex lowercase dengan `apiKey` sebagai secret**
(metode MD5 lama sudah obsolete).

| Endpoint | Method | stringToSign |
|---|---|---|
| `/api/merchant/paymentmethod/getpaymentmethod` | POST JSON | `merchantcode + amount + datetime` (`yyyy-MM-dd HH:mm:ss`) |
| `/api/merchant/v2/inquiry` (create transaction) | POST JSON | `merchantCode + merchantOrderId + paymentAmount` |
| `/api/merchant/transactionStatus` | POST JSON | `merchantCode + merchantOrderId` |
| Callback (Duitku → kita) | POST `x-www-form-urlencoded` | `merchantCode + amount + merchantOrderId` |

### Create transaction (`v2/inquiry`)
Request wajib: `merchantCode`, `paymentAmount` (integer, tanpa desimal), `merchantOrderId`
(unik), `productDetails`, `email`, `paymentMethod` (kode 2 huruf, mis. `VC`, `BT`, `M2`,
`SP`, `OV`, `DA`, `SA`, `LA`, `QR`), `customerVaName`, `returnUrl`, `callbackUrl`,
`signature`. Opsional: `phoneNumber`, `itemDetails[]`, `customerDetail{}`, `expiryPeriod`
(menit), `additionalParam`, `merchantUserInfo`.

Response: `{ merchantCode, reference, paymentUrl, vaNumber, qrString, AppUrl, amount,
statusCode, statusMessage }` — `statusCode "00"` = SUCCESS. User diarahkan ke `paymentUrl`.

### Callback (POST form-urlencoded ke callbackUrl kita)
Field: `merchantCode`, `amount`, `merchantOrderId`, `productDetail`, `additionalParam`,
`paymentCode`, `resultCode` (`00` sukses / `01` gagal), `merchantUserId`, `reference`,
`signature`, `publisherOrderId`, `spUserHash?`, `settlementDate?`, `issuerCode?`,
`customerName?`.

Aturan penting:
- Verifikasi signature sebelum memproses; tolak kalau tidak cocok.
- Balas HTTP 200 secepatnya (body bebas, mis. `OK`). Duitku retry kalau non-200.
- Callback **idempoten** — bisa terkirim lebih dari sekali untuk order yang sama.
- Jangan pernah percaya `amount` dari callback tanpa dicocokkan dengan order di DB.

### Return URL (redirect user, bukan otoritatif)
`GET /return?merchantOrderId=...&resultCode=00&reference=...` — hanya untuk UI.
Status final tetap dari callback / `transactionStatus`.

## 2. Kondisi repo saat ini
- Belum ada kode Duitku sama sekali; belum ada callback URL.
- API routes existing: `app/api/contact`, `app/api/revalidate`, `app/api/auth/[...nextauth]`.
- `proxy.ts` hanya match `/admin/:path*` → route publik `/callback` tidak kena auth. ✅
- Drizzle + Neon (`prepare: false`), migrasi di `db/migrations/`.

## 3. Rencana bertahap

### Phase 0 — Fondasi (SELESAI & terverifikasi)
- `lib/duitku.ts`: config env, `duitkuSignature()`, `verifyCallbackSignature()`
  (timing-safe compare), tipe callback payload, parser form-urlencoded.
- `app/callback/route.ts`: **`POST /callback`** — endpoint callback Duitku.
  Verifikasi signature → log terstruktur → balas `200 OK`. Ada juga `GET /callback`
  yang balas 405 supaya gampang dicek kalau salah method.
- `.env.example`: `DUITKU_MERCHANT_CODE`, `DUITKU_API_KEY`, `DUITKU_ENV`, `DUITKU_CALLBACK_URL`, `DUITKU_RETURN_URL`.
- `pnpm duitku:check` (`scripts/duitku-check.ts`) — validasi kredensial via getPaymentMethod.
  Sudah dites: merchant `DS34021` sandbox → 25 metode aktif.
- `scripts/duitku-callback-test.sh` — simulasi callback (valid / duplicate / tampered /
  amount diubah / field kurang / GET). Hasil: `200 / 200 / 400 / 400 / 400 / 405`. ✅

**⚠️ Gotcha Next 16 (cacheComponents):** repo ini mengaktifkan `cacheComponents`, jadi
route segment config `export const runtime` / `export const dynamic` **dilarang** —
bikin route-nya 500 total. Node runtime sudah default dan route handler POST yang
membaca body memang selalu dinamis, jadi keduanya tidak diperlukan.

### Phase 1 — Persistensi (SELESAI, migrasi sudah di-apply)
`db/migrations/0003_cloudy_banshee.sql` — additive, tidak menyentuh tabel existing:
- enum `payment_status` (`pending|paid|failed|expired`)
- `payments` — `merchant_order_id` UNIQUE (kunci idempotency), `amount` bigint,
  `status`, `payment_method`, `reference`, `publisher_order_id`, `payment_url`,
  `va_number`, `project_id?`, `user_id?`, `paid_at`, `expires_at`, timestamps.
  Index: `status`, `created_at`.
- `payment_events` — audit tiap callback: `payment_id?`, `merchant_order_id`,
  `source`, `result_code`, `signature_valid`, `payload` jsonb. Index: `merchant_order_id`.
  (`payment_id` nullable supaya callback untuk order tak dikenal tetap terekam.)

`lib/payments.ts` — `createPendingPayment`, `getPaymentByOrderId`,
`attachInquiryResult`, `recordPaymentEvent`, `applyCallback`.

**Aturan `applyCallback`:**
1. Selalu catat event dulu (audit), baru mutasi status.
2. `amount` dari callback dicocokkan dengan `payments.amount` — mismatch → tidak
   diapa-apakan, cuma dilog `AMOUNT MISMATCH` (tetap balas 200 supaya Duitku berhenti retry).
3. Update pakai guard `WHERE status = 'pending'` → idempoten dan aman kalau dua
   callback datang bersamaan.
4. Gagal nulis DB → balas **500** biar Duitku retry (jangan sampai pembayaran hilang).

**Matriks tes (semua lolos, lawan Neon beneran):**

| Skenario | HTTP | Efek DB |
|---|---|---|
| signature valid, `resultCode=00` | 200 | `pending` → `paid`, `paidAt` keisi |
| callback duplikat | 200 | tidak berubah (`duplicate ignored`) |
| signature dipalsukan | 400 | tidak ada perubahan |
| `amount` diubah (signature jadi invalid) | 400 | tidak ada perubahan |
| `amount` valid-sign tapi beda dari DB | 200 | status tetap `pending`, log `AMOUNT MISMATCH` |
| order tak dikenal | 200 | tercatat di `payment_events` saja |
| `resultCode=01` | 200 | `pending` → `failed` |
| field kurang | 400 | — |
| `GET /callback` | 405 | — |

Helper: `pnpm duitku:pending [orderId] [amount]` (bikin row pending),
`pnpm duitku:inspect [orderId]` (lihat payments / detail + event).

### Phase 2 — Create transaction
- `lib/duitku.ts`: `getPaymentMethods(amount)`, `createTransaction(params)`.
- `POST /api/payments/create` (server action / route): buat row `pending`, panggil
  inquiry, simpan `reference` + `paymentUrl`, balas `paymentUrl`.
- Amount **selalu** ditentukan server-side dari data DB, tidak dari body client.

### Phase 3 — UI sandbox
- Halaman internal `/admin/payments/sandbox` (atau `/portal`): pilih metode
  pembayaran (dari getPaymentMethod), amount, submit → redirect ke `paymentUrl`.
- `app/(public)/payment/return/page.tsx`: baca query param, tampilkan status
  sementara, lalu polling `transactionStatus` untuk konfirmasi.

### Phase 4 — Rekonsiliasi & test
- `POST /api/payments/[orderId]/status` → panggil `transactionStatus` (jangan polling agresif, ada rate limit).
- Script `scripts/duitku-sandbox-smoke.ts`: inquiry sandbox + simulasi callback lokal.
- Playwright e2e: hit `/callback` dengan signature valid/invalid.

## 4. Cara testing sandbox
1. Daftar sandbox di https://sandbox.duitku.com, ambil `merchantCode` + `apiKey`.
2. Isi `.env.local`: `DUITKU_ENV=sandbox`, `DUITKU_MERCHANT_CODE`, `DUITKU_API_KEY`.
3. Validasi kredensial: `pnpm duitku:check`.
4. Tes callback **tanpa tunnel** (cukup untuk iterasi logic):
   ```bash
   pnpm dev                                   # cek port yang kepakai!
   scripts/duitku-callback-test.sh            # default http://localhost:3000
   BASE_URL=http://localhost:3001 scripts/duitku-callback-test.sh
   ```
5. Tes end-to-end (Duitku beneran nembak callback) — pakai Cloudflare Tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000     # samakan portnya!
   # ambil URL https://xxx.trycloudflare.com dari output, lalu:
   #   .env.local → DUITKU_CALLBACK_URL=https://xxx.trycloudflare.com/callback
   # verifikasi tunnel tembus:
   BASE_URL=https://xxx.trycloudflare.com scripts/duitku-callback-test.sh
   ```
   `cloudflared` sudah terpasang di `~/.local/bin/cloudflared`. URL quick tunnel
   **berubah tiap restart** — update `DUITKU_CALLBACK_URL` tiap kali.

**⚠️ Gotcha port:** port 3000 sering sudah dipakai project lain (`lelang-koperasi`),
Next otomatis pindah ke 3001. Kalau tunnel diarahkan ke 3000 padahal app di 3001,
yang kena tunnel adalah project lain → gejalanya 404 aneh. Selalu cek baris
`- Local: http://localhost:PORT` di output `pnpm dev`.
Error Cloudflare **1033/530** = `cloudflared` mati atau URL-nya sudah basi.

## 5. Guardrails
- `DUITKU_API_KEY` **hanya** server-side (jangan `NEXT_PUBLIC_*`).
- Callback route wajib `runtime = "nodejs"` (butuh `node:crypto`) + `dynamic = "force-dynamic"`.
- Jangan pernah menandai order `paid` dari `returnUrl` — hanya dari callback/status API.
- Log jangan pernah mencetak `apiKey`.
