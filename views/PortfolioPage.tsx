"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">
      {children}
    </span>
  );
}

function SectionDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  );
}

type Project = {
  title: string;
  slug: string;
  url: string;
  category: string;
  desc: { id: string; en: string };
  tags: string[];
};

/**
 * Portfolio card that lazy-loads a live, scaled-down iframe of the real site
 * on first hover — a screenshot stays underneath as the instant/fallback view.
 */
function ProjectCard({
  project,
  index,
  language,
  liveLabel,
  visitLabel,
  previewLabel,
}: {
  project: Project;
  index: number;
  language: "id" | "en";
  liveLabel: string;
  visitLabel: string;
  previewLabel: string;
}) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setActive(true)}
      className="group block"
    >
      <Card className="h-full bg-white/[0.02] border border-white/[0.06] group-hover:border-blue-500/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-blue-600/20 overflow-hidden p-0">
        <div className="relative h-48 overflow-hidden bg-[#0a1628]">
          {/* Screenshot (instant + fallback) */}
          <img
            src={`/portfolio/${project.slug}.jpg`}
            alt={`Screenshot ${project.title}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Live iframe — mounts on first hover, fades in over the screenshot */}
          {active && (
            <iframe
              src={project.url}
              title={`Live preview ${project.title}`}
              loading="lazy"
              tabIndex={-1}
              aria-hidden
              onLoad={() => setLoaded(true)}
              className={`absolute inset-0 h-[285%] w-[285%] origin-top-left scale-[0.35] border-0 pointer-events-none transition-opacity duration-700 ${
                loaded ? "opacity-0 group-hover:opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Loading hint while iframe warms up */}
          {active && !loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[11px] text-gray-300 border border-white/10">
                {previewLabel}
              </span>
            </div>
          )}

          {/* Live badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white border border-white/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {liveLabel}
          </div>

          {/* Visit pill on hover */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-center pb-4 pt-10 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20">
              <ExternalLink className="w-4 h-4" />
              {visitLabel}
            </span>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-blue-600/15 text-blue-400 border border-blue-500/10 font-semibold">
              {project.category}
            </Badge>
            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.desc[language]}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, tagIndex) => (
              <Badge
                key={tagIndex}
                variant="secondary"
                className="text-xs bg-white/[0.04] text-gray-400 border border-white/[0.06]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
}

export default function PortfolioPage() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);

  const projects: Project[] = [
    {
      title: "LIPAN-RI",
      slug: "lipan-ri",
      url: "https://www.lipan-ri.com",
      category: "Website",
      desc: {
        id: "Portal media & publikasi resmi dengan manajemen artikel dan tampilan berita yang rapi.",
        en: "Official media & publication portal with article management and a clean news layout.",
      },
      tags: ["Next.js", "Tailwind CSS", "CMS"],
    },
    {
      title: "Aset Nusantara Internasional",
      slug: "aset-nusantara",
      url: "https://www.asetnusantarainternasional.com",
      category: "Company Profile",
      desc: {
        id: "Company profile institusi dengan identitas visual kuat dan struktur layanan yang jelas.",
        en: "Institutional company profile with a strong visual identity and clear service structure.",
      },
      tags: ["Next.js", "Tailwind CSS"],
    },
    {
      title: "Harun Pratitno Law Firm",
      slug: "harun-lawfirm",
      url: "https://www.harunlawfirm.com",
      category: "Company Profile",
      desc: {
        id: "Website firma hukum profesional dengan halaman layanan, profil tim, dan konsultasi.",
        en: "Professional law firm website with services, team profiles, and consultation pages.",
      },
      tags: ["Next.js", "Tailwind CSS"],
    },
    {
      title: "FinEdu",
      slug: "finedu",
      url: "https://www.finedu.my.id",
      category: "Web App",
      desc: {
        id: "Platform edukasi fintech dengan kuis interaktif, gamifikasi, XP, achievement, dan leaderboard.",
        en: "Fintech education platform with interactive quizzes, gamification, XP, achievements, and a leaderboard.",
      },
      tags: ["Next.js", "Auth", "Database"],
    },
    {
      title: "Tiga Anak Propertindo — Katalog",
      slug: "next-property-catalog",
      url: "https://next-property-catalog.vercel.app",
      category: "Web App",
      desc: {
        id: "Katalog properti dengan pencarian & filter (rumah, apartemen, tanah) dan halaman detail listing.",
        en: "Property catalog with search & filters (house, apartment, land) and listing detail pages.",
      },
      tags: ["Next.js", "Tailwind CSS", "Search"],
    },
    {
      title: "Terrasmave",
      slug: "terrasmave",
      url: "https://terrasmave.vercel.app",
      category: "Landing Page",
      desc: {
        id: "Landing page brand F&B (es krim sandwich homemade) dengan menu dan pemesanan via WhatsApp.",
        en: "F&B brand landing page (homemade ice cream sandwich) with menu and WhatsApp ordering.",
      },
      tags: ["Next.js", "Tailwind CSS"],
    },
    {
      title: "NudgeCart",
      slug: "nudgecart",
      url: "https://nudgecart.vercel.app",
      category: "Web App",
      desc: {
        id: "Toko online sembako dengan katalog produk, kategori, promo, dan keranjang belanja.",
        en: "Online grocery store with product catalog, categories, promos, and a shopping cart.",
      },
      tags: ["Next.js", "E-Commerce", "Cart"],
    },
    {
      title: "Auto Jalan",
      slug: "auto-jalan",
      url: "https://auto-jalan.vercel.app",
      category: "Web App",
      desc: {
        id: "Aplikasi panggil montir on-demand — montir terpercaya datang ke lokasi kendaraan pengguna.",
        en: "On-demand mechanic app — trusted mechanics come to the user's vehicle location.",
      },
      tags: ["Next.js", "Mobile-first"],
    },
    {
      title: "Tiga Anak Propertindo",
      slug: "tiga-anak-propertindo",
      url: "https://www.tigaanakpropertindo.com",
      category: "Company Profile",
      desc: {
        id: "Company profile pengembang properti dengan fokus kredibilitas dan perencanaan proyek yang matang.",
        en: "Property developer company profile focused on credibility and thorough project planning.",
      },
      tags: ["Next.js", "Tailwind CSS"],
    },
  ];

  const categories =
    language === "id"
      ? ["Semua", "Company Profile", "Web App", "Website", "Landing Page"]
      : ["All", "Company Profile", "Web App", "Website", "Landing Page"];

  const filtered =
    active === 0
      ? projects
      : projects.filter((p) => p.category === categories[active]);

  const visitLabel = language === "id" ? "Kunjungi Situs" : "Visit Site";
  const liveLabel = language === "id" ? "Live" : "Live";
  const previewLabel = language === "id" ? "Memuat preview…" : "Loading preview…";

  return (
    <div className="pt-16 bg-[#050b16]">
      <PageHero
        eyebrow={t("portfolio.label")}
        title={t("portfolio.title")}
        subtitle={t("portfolio.subtitle")}
      />

      {/* Filter Tabs */}
      <section className="relative py-8 bg-[#050b16] border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4 text-center">
            <SectionLabel>{t("portfolio.categories")}</SectionLabel>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={
                  index === active
                    ? "rounded-full px-5 py-2.5 text-sm bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300"
                    : "rounded-full px-5 py-2.5 text-sm bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative py-20 bg-[#050b16]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
            <SectionLabel>{t("portfolio.projects")}</SectionLabel>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                language={language}
                liveLabel={liveLabel}
                visitLabel={visitLabel}
                previewLabel={previewLabel}
              />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <section className="relative py-20 bg-[#050b16] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("portfolio.readyToCreate")}
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              {t("portfolio.readyToCreate.desc")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300"
            >
              <a href="/contact">{t("portfolio.startYourProject")}</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
