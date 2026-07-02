import { config } from "dotenv";
config({ path: ".env" });

import { eq } from "drizzle-orm";

const [{ db }, { articles, users, categories }, { slugify }] = await Promise.all([
    import("../db"),
    import("../db/schema"),
    import("@blawness/admin-kit"),
]);

// Seed user and category first
await db.insert(users).values({
    name: "Vorca Team",
    email: "admin@vorca.com",
    passwordHash: "dummy",
}).onConflictDoNothing();

await db.insert(categories).values({
    name: "Technology",
    slug: "technology",
}).onConflictDoNothing();

const articleData = [
    {
        title: "Panduan Lengkap Memulai Bisnis Online untuk Pemula",
        excerpt:
            "Pelajari langkah-langkah praktis memulai bisnis online dari nol, mulai dari riset pasar hingga strategi pemasaran digital yang efektif.",
        content: `<h2 id="mengapa-bisnis-online">Mengapa Bisnis Online?</h2>
<p>Bisnis online menjadi pilihan utama banyak pengusaha di era digital ini. Dengan modal yang relatif lebih kecil dibandingkan bisnis konvensional, siapa pun bisa memulai usaha mereka sendiri.</p>
<h2 id="langkah-pertama">Langkah Pertama: Riset Pasar</h2>
<p>Sebelum memulai, lakukan riset pasar untuk memahami kebutuhan target audiens Anda. Identifikasi masalah yang mereka hadapi dan tawarkan solusi yang tepat.</p>
<h2 id="membangun-brand">Membangun Brand yang Kuat</h2>
<p>Brand yang kuat akan membedakan Anda dari kompetitor. Fokus pada nilai unik yang ditawarkan dan konsisten dalam setiap komunikasi.</p>
<h2 id="strategi-pemasaran">Strategi Pemasaran Digital</h2>
<p>Gunakan kombinasi SEO, media sosial, dan email marketing untuk menjangkau audiens yang lebih luas. Analisis data secara berkala untuk mengoptimalkan strategi Anda.</p>`,
        categoryId: 1,
        authorId: 1,
        status: "published" as const,
    },
    {
        title: "Tips Optimalisasi Performa Website dengan Next.js 16",
        excerpt:
            "Tingkatkan kecepatan dan performa website Anda dengan teknik-teknik terbaru di Next.js 16, termasuk server components dan partial prerendering.",
        content: `<h2 id="mengapa-performa-penting">Mengapa Performa Website Penting?</h2>
<p>Kecepatan loading website mempengaruhi user experience, konversi, dan peringkat SEO. Setiap detik keterlambatan dapat menurunkan konversi secara signifikan.</p>
<h2 id="server-components">React Server Components</h2>
<p>Next.js 16 memanfaatkan React Server Components untuk mengurangi JavaScript yang dikirim ke browser. Komponen yang tidak membutuhkan interaktivitas sebaiknya di-render di server.</p>
<h2 id="image-optimization">Optimasi Gambar</h2>
<p>Gunakan komponen <code>next/image</code> untuk optimasi gambar otomatis, termasuk lazy loading, responsive images, dan format WebP/AVIF.</p>
<h2 id="caching-strategy">Strategi Caching</h2>
<p>Implementasikan caching yang tepat dengan ISR (Incremental Static Regeneration) dan revalidation berbasis tag untuk konten dinamis.</p>`,
        categoryId: 1,
        authorId: 1,
        status: "published" as const,
    },
    {
        title: "Mengenal UI/UX Design: Prinsip Dasar untuk Pemula",
        excerpt:
            "Pahami prinsip-prinsip dasar UI/UX design yang wajib diketahui setiap desainer pemula untuk menciptakan pengalaman pengguna yang luar biasa.",
        content: `<h2 id="apa-itu-ui-ux">Apa itu UI dan UX?</h2>
<p>UI (User Interface) berfokus pada tampilan visual produk, sedangkan UX (User Experience) berfokus pada bagaimana pengguna berinteraksi dengan produk. Keduanya sama pentingnya.</p>
<h2 id="prinsip-desain">Prinsip Dasar Desain</h2>
<p>Beberapa prinsip dasar yang perlu diperhatikan: konsistensi, hierarki visual, kontras, keseimbangan, dan ruang putih (white space). Terapkan prinsip-prinsip ini secara konsisten.</p>
<h2 id="riset-pengguna">Riset Pengguna</h2>
<p>Lakukan riset untuk memahami kebutuhan dan pain points pengguna. Metode yang umum digunakan: wawancara, survei, dan usability testing.</p>
<h2 id="tools-desain">Tools Desain yang Direkomendasikan</h2>
<p>Figma, Sketch, dan Adobe XD adalah tools populer untuk desain UI/UX. Pilih yang paling sesuai dengan kebutuhan dan workflow tim Anda.</p>`,
        categoryId: 1,
        authorId: 1,
        status: "published" as const,
    },
];

for (const data of articleData) {
    const slug = slugify(data.title);
    const existing = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

    if (existing.length > 0) {
        console.log(`Skipped (exists): ${data.title} (${slug})`);
        continue;
    }

    await db.insert(articles).values({
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        authorId: data.authorId,
        publishedAt: new Date(),
        status: data.status,
    });

    console.log(`Inserted: ${data.title} (${slug})`);
}

console.log("\nDone seeding 3 articles.");
process.exit(0);
