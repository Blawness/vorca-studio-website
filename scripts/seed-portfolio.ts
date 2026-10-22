// One-time import of the portfolio entries that used to be hardcoded in
// views/PortfolioPage.tsx + views/HomePage.tsx. Idempotent (skips existing slugs).
// Rows are visible; run "Sync from Vercel" afterwards to link them to projects.
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const [{ db }, { portfolioItems }] = await Promise.all([
    import("../db"),
    import("../db/schema"),
]);

type Seed = {
    slug: string;
    title: string;
    url: string;
    category: string;
    id: string;
    en: string;
    tags: string[];
};

const SEEDS: Seed[] = [
    {
        slug: "harun-lawfirm",
        title: "Harun Pratitno Law Firm",
        url: "https://www.harunlawfirm.com",
        category: "Company Profile",
        id: "Company profile firma hukum dengan tampilan profesional dan kredibel.",
        en: "Law firm company profile with a professional, credible look.",
        tags: ["Next.js", "Tailwind CSS"],
    },
    {
        slug: "finedu",
        title: "FinEdu",
        url: "https://www.finedu.my.id",
        category: "Web App",
        id: "Platform edukasi fintech dengan kuis interaktif, gamifikasi, XP, achievement, dan leaderboard.",
        en: "Fintech education platform with interactive quizzes, gamification, XP, achievements, and a leaderboard.",
        tags: ["Next.js", "Auth", "Database"],
    },
    {
        slug: "nudgecart",
        title: "NudgeCart",
        url: "https://nudgecart.vercel.app",
        category: "Web App",
        id: "Toko online sembako dengan katalog produk, kategori, promo, dan keranjang belanja.",
        en: "Online grocery store with product catalog, categories, promos, and a shopping cart.",
        tags: ["Next.js", "E-Commerce", "Cart"],
    },
    {
        slug: "lipan-ri",
        title: "LIPAN-RI",
        url: "https://www.lipan-ri.com",
        category: "Website",
        id: "Portal media & publikasi resmi dengan manajemen artikel dan tampilan berita yang rapi.",
        en: "Official media & publication portal with article management and a clean news layout.",
        tags: ["Next.js", "Tailwind CSS", "CMS"],
    },
    {
        slug: "aset-nusantara",
        title: "Aset Nusantara Internasional",
        url: "https://www.asetnusantarainternasional.com",
        category: "Company Profile",
        id: "Company profile institusi dengan identitas visual kuat dan struktur layanan yang jelas.",
        en: "Institutional company profile with a strong visual identity and clear service structure.",
        tags: ["Next.js", "Tailwind CSS"],
    },
    {
        slug: "next-property-catalog",
        title: "Tiga Anak Propertindo — Katalog",
        url: "https://next-property-catalog.vercel.app",
        category: "Web App",
        id: "Katalog properti dengan pencarian & filter (rumah, apartemen, tanah) dan halaman detail listing.",
        en: "Property catalog with search & filters (house, apartment, land) and listing detail pages.",
        tags: ["Next.js", "Tailwind CSS", "Search"],
    },
    {
        slug: "terrasmave",
        title: "Terrasmave",
        url: "https://terrasmave.vercel.app",
        category: "Landing Page",
        id: "Landing page brand F&B (es krim sandwich homemade) dengan menu dan pemesanan via WhatsApp.",
        en: "F&B brand landing page (homemade ice cream sandwich) with menu and WhatsApp ordering.",
        tags: ["Next.js", "Tailwind CSS"],
    },
    {
        slug: "auto-jalan",
        title: "Auto Jalan",
        url: "https://auto-jalan.vercel.app",
        category: "Web App",
        id: "Aplikasi panggil montir on-demand — montir terpercaya datang ke lokasi kendaraan pengguna.",
        en: "On-demand mechanic app — trusted mechanics come to the user's vehicle location.",
        tags: ["Next.js", "Mobile-first"],
    },
    {
        slug: "koka-scent",
        title: "Koka Scent",
        url: "https://koka-scent.vercel.app",
        category: "Web App",
        id: "Toko online parfum oil-based bergaya Jepang dengan katalog produk, filter, dan keranjang belanja.",
        en: "Japanese-inspired oil-based perfume store with a filterable product catalog and shopping cart.",
        tags: ["Next.js", "E-Commerce", "Cart"],
    },
    {
        slug: "tiga-anak-propertindo",
        title: "Tiga Anak Propertindo",
        url: "https://www.tigaanakpropertindo.com",
        category: "Company Profile",
        id: "Company profile pengembang properti dengan fokus kredibilitas dan perencanaan proyek yang matang.",
        en: "Property developer company profile focused on credibility and thorough project planning.",
        tags: ["Next.js", "Tailwind CSS"],
    },
];

const result = await db
    .insert(portfolioItems)
    .values(
        SEEDS.map((s, i) => ({
            slug: s.slug,
            title: s.title,
            url: s.url,
            category: s.category,
            descriptionId: s.id,
            descriptionEn: s.en,
            tags: s.tags,
            thumbnailUrl: `/portfolio/${s.slug}.jpg`,
            visible: true,
            sortOrder: i,
        }))
    )
    .onConflictDoNothing({ target: portfolioItems.slug })
    .returning({ slug: portfolioItems.slug });

console.log(`Inserted ${result.length} of ${SEEDS.length} portfolio items.`);
process.exit(0);
