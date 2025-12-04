# `about-layout.md`

```md
# ABOUT PAGE BLUEPRINT — VORCA STUDIO  
Halaman "Tentang" dengan tone premium, modern, dan berfokus pada posisi full-stack digital studio.  
Gunakan struktur, spacing, dan styling berikut untuk menghasilkan UI yang konsisten.

---

# 1. PAGE HERO  
**Component:** `<PageHero />`  
**Goal:** transisi smooth dari hero ke isi menggunakan fade gradient global.

## HERO CONTENT
Title:  
`Tentang Vorca Studio`

Subtitle:  
`Studio pengembangan web dan aplikasi berbasis web yang dibangun dengan prinsip presisi, strategi, dan arsitektur modern.`

### Layout Styling
- Height: `py-20 md:py-28`
- Max width: `max-w-5xl mx-auto px-4`
- Title size: `text-4xl md:text-6xl font-semibold`
- Subtitle: `text-slate-300/80 max-w-2xl mt-4`

### Gradient Fade (wajib)
```

absolute bottom-0 inset-x-0
h-24 md:h-32
bg-gradient-to-b from-transparent to-[#050b16]
pointer-events-none

```

---

# 2. SECTION: "Mengapa Orca?"

## Struktur Layout
2 kolom (stack vertical on mobile).

```

| Left card  | Right image |

```

## Left Card Content
Title: **Mengapa Orca?**

Body:  
Orca dikenal sebagai predator laut dengan strategi, presisi, dan kerja tim yang solid. Cara kerja itu yang kami bawa ke dunia pengembangan web.

- kami pelajari konteks bisnis,
- kami rancang arsitektur sistemnya,
- kami eksekusi secara fokus hingga siap dipakai.

Filosofi inti:  
**membangun sistem yang relevan, kuat, dan berorientasi pada hasil nyata.**

## Right Image
Gunakan placeholder image: diver / underwater / blue aesthetic.  
Style:
- Rounded-xl  
- Soft border: `border border-white/10`  
- Drop glow subtle: `shadow-[0_0_40px_-10px_rgba(0,140,255,0.3)]`  

---

# 3. SECTION: NILAI-NILAI KAMI

## Title
`Nilai-Nilai Kami`  
Subtitle: `Prinsip yang memandu cara kami merancang dan membangun solusi digital.`

## Card Layout (4 cards)
Use grid:
```

grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6

```

### Card Style
- Rounded: `rounded-2xl`
- Border: `border border-white/10`
- Background: `bg-white/5 backdrop-blur-xl`
- Padding: `p-6`
- Icon badge: `bg-gradient-to-b from-cyan-400 to-blue-500 p-3 rounded-xl mb-4`

### Card Copy (final)
**Presisi**  
Setiap detail penting: dari struktur database hingga microcopy dalam UI.

**Kekuatan**  
Menggunakan stack modern yang stabil, scalable, dan mudah dirawat.

**Kolaborasi**  
Bekerja dekat dengan klien dari ide hingga peluncuran.

**Ownership**  
Kami memperlakukan proyek seolah itu sistem internal kami sendiri.

---

# 4. SECTION: TEAM

## Title
`Kenali Tim Kami`  
Subtitle: `Individu yang berfokus pada engineering dan solusi digital.`

## Layout
2 cards, centered:

```

grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto

```

### Team Card Style
- Rounded-xl  
- `bg-white/5 border border-white/10 backdrop-blur-lg`  
- Padding: `p-6 md:p-8`  
- Flex vertical: `flex flex-col items-center text-center`  
- Avatar:  
  - Size: `w-20 h-20 md:w-24 md:h-24`  
  - Rounded-full  
  - Border glow subtle  

### Copy

**Yudha Hafiz — Founder & Full-Stack Web Developer**  
Fokus pada arsitektur aplikasi, Next.js, React, database modern, dan integrasi backend.

**Andhika Satya — Product & Client Strategy**  
Menerjemahkan kebutuhan bisnis menjadi alur fitur yang jelas dan prioritas proyek yang realistis.

---

# 5. SECTION: TRACK RECORD

## Layout
Centered statistic blocks (4 items)

```

grid grid-cols-2 md:grid-cols-4 gap-8 text-center

```

## Styling
- Number: `text-3xl md:text-4xl font-semibold text-cyan-400`
- Label: `text-sm text-slate-400 mt-1`

## Copy
- Klien dari berbagai industri  
- Puluhan proyek web & web app  
- Beberapa tahun pengalaman  
- Fokus pada kualitas & maintainability  

(Opsional versi angka:)
- **50+** Klien  
- **80+** Proyek  
- **5+** Tahun pengalaman  

---

# 6. GLOBAL STYLING RULES (penting)

### Background
Seluruh halaman gunakan:
```

bg-[#050b16]

```
Dengan subtle noise / grain opsional.

### Section Spacing
- `py-16 md:py-24` per section  
- Container:
```

max-w-6xl mx-auto px-4

```

### Typography
- Heading: `font-semibold tracking-tight`
- Body: `text-slate-300/90`
- Subtitle: `text-slate-300/70`

### Icon Style
- Icon always in glowing gradient badge:
```

rounded-xl p-3 bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(0,150,255,0.3)]

```

### Divider Logic
Jangan pakai garis solid. Gunakan:
```

h-[1px] bg-white/5 mx-auto w-full mt-12

```

---

# 7. RESPONSIVE BEHAVIOR

### Mobile
- Semua grids → 1 column  
- Margin-top hero: reduce 20%  
- Padding page: `px-4`  
- Avatar team small size  
- Remove hover effects

### Tablet
- 2 columns for values  
- 2 columns for team  
- Hero text center-aligned

### Desktop
- Full spacing  
- Multi-grid layout  
- Fade transition always visible  

---

# 8. PAGE GOAL (biar Cursor ngerti konteks)

**Halaman About ini harus membangun trust dan menunjukkan bahwa Vorca Studio adalah full-stack engineering studio dengan mindset strategis yang presisi — bukan agency desain biasa.**  
Fokus pada storytelling, kejelasan layout, dan tampilan visual premium.

```

---

