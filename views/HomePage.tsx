"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Zap,
  Layout,
  Shield,
  Monitor,
  Building,
  Grid3x3,
  ArrowUpRight,
  Quote,
  Star,
  Cpu,
  Layers,
  BookOpen,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import {
  NextjsLogo,
  TypeScriptLogo,
  TailwindLogo,
  VercelLogo,
  SupabaseLogo,
} from "@/components/TechLogos";
import { CountUp } from "@/components/CountUp";
import TiltCard from "@/components/effects/TiltCard";
import Magnetic from "@/components/effects/Magnetic";

/** Cursor-following spotlight: sets --x/--y on the card so an overlay can glow. */
function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

/** A single Bento grid cell with icon, copy, and cursor spotlight. */
function BentoCell({
  icon: Icon,
  title,
  desc,
  delay = 0,
  wide = false,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  delay?: number;
  wide?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onMouseMove={handleSpotlight}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-blue-500/20 transition-colors duration-300 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--x) var(--y), rgba(56,189,248,0.08), transparent 60%)" }}
      />
      <div className="relative">
        <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-cyan-300" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
};

const container = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">
      {children}
    </span>
  );
}

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />;
}

export default function HomePage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Monitor,
      title: t("services.landing.title"),
      desc: t("services.landing.desc"),
      popular: false,
    },
    {
      icon: Building,
      title: t("services.company.title"),
      desc: t("services.company.desc"),
      popular: true,
    },
    {
      icon: Grid3x3,
      title: t("services.webapp.title"),
      desc: t("services.webapp.desc"),
      popular: false,
    },
  ];

  const stats = [
    { value: t("stats.projects.value"), label: t("stats.projects.label") },
    { value: t("stats.clients.value"), label: t("stats.clients.label") },
    { value: t("stats.satisfaction.value"), label: t("stats.satisfaction.label") },
    { value: t("stats.experience.value"), label: t("stats.experience.label") },
  ];

  const testimonials = [
    { quote: t("testimonials.1.quote"), name: t("testimonials.1.name"), role: t("testimonials.1.role") },
    { quote: t("testimonials.2.quote"), name: t("testimonials.2.name"), role: t("testimonials.2.role") },
    { quote: t("testimonials.3.quote"), name: t("testimonials.3.name"), role: t("testimonials.3.role") },
  ];

  const processSteps = [
    { num: "01", title: t("process.step1.title"), desc: t("process.step1.desc") },
    { num: "02", title: t("process.step2.title"), desc: t("process.step2.desc") },
    { num: "03", title: t("process.step3.title"), desc: t("process.step3.desc") },
    { num: "04", title: t("process.step4.title"), desc: t("process.step4.desc") },
  ];

  const techItems = [
    { name: "Next.js", desc: t("tech.nextjs.label"), Logo: NextjsLogo },
    { name: "TypeScript", desc: t("tech.typescript.label"), Logo: TypeScriptLogo },
    { name: "Tailwind CSS", desc: t("tech.tailwind.label"), Logo: TailwindLogo },
    { name: "Vercel", desc: t("tech.vercel.label"), Logo: VercelLogo },
    { name: "Supabase", desc: t("tech.supabase.label"), Logo: SupabaseLogo },
  ];

  const portfolioItems = [
    { title: "Harun Pratitno Law Firm", category: "Company Profile", slug: "harun-lawfirm", url: "https://www.harunlawfirm.com" },
    { title: "FinEdu", category: "Web App", slug: "finedu", url: "https://www.finedu.my.id" },
    { title: "NudgeCart", category: "Web App", slug: "nudgecart", url: "https://nudgecart.vercel.app" },
  ];

  return (
    <div className="bg-[#050b16]">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background lighting */}
        <div className="absolute inset-0 bg-[#050b16]">
          {/* Drifting aurora blobs */}
          <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[100px] bg-[radial-gradient(circle,rgba(37,99,235,0.25)_0%,transparent_65%)] animate-aurora-1" />
          <div className="absolute top-[10%] left-[10%] w-[520px] h-[520px] rounded-full blur-[100px] bg-[radial-gradient(circle,rgba(6,182,212,0.16)_0%,transparent_65%)] animate-aurora-2" />
          {/* Main blue spotlight behind laptop area (right side) */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[900px] h-[900px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.15)_0%,rgba(37,99,235,0.05)_40%,transparent_70%)]" />
          {/* Bottom ambient */}
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_60%)]" />
          {/* Grid overlay for depth */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>

        <div className={`${container} relative z-10 w-full py-24`}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <SectionLabel>{t("hero.label")}</SectionLabel>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 bg-gradient-to-br from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent"
              >
                {t("hero.headline")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                {[
                  { icon: Zap, text: t("hero.feature1") },
                  { icon: Layout, text: t("hero.feature2") },
                  { icon: Shield, text: t("hero.feature3") },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300"
                  >
                    <f.icon className="w-4 h-4 text-blue-400" />
                    {f.text}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Magnetic strength={0.4}>
                  <Button
                    asChild
                    size="lg"
                    className="h-auto rounded-lg px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 transition-all duration-300 border-0 gap-2 text-sm"
                  >
                    <a
                      href="https://wa.me/6285167002152"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="w-4 h-4" />
                      {t("hero.cta.dm")}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </Magnetic>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 h-auto rounded-lg px-6 py-3.5 text-sm font-medium text-gray-200 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
                >
                  {t("hero.cta.portfolio")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block relative"
            >
              {/* Blue glow behind dashboard */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.2)_0%,transparent_60%)] pointer-events-none" />
              <TiltCard max={9} className="relative bg-[#0a1628]/80 rounded-xl border border-blue-500/10 p-5 shadow-2xl shadow-blue-900/30 backdrop-blur-sm">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <div className="ml-3 flex-1 h-5 bg-white/[0.04] rounded-md flex items-center px-3">
                    <span className="text-[10px] text-gray-500 tracking-wide">app.vorca.studio/dashboard</span>
                  </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Revenue", value: "Rp 248jt", delta: "+12.4%" },
                    { label: "Visitors", value: "18.2k", delta: "+8.1%" },
                    { label: "Conversion", value: "4.7%", delta: "+1.3%" },
                  ].map((kpi, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <p className="text-[10px] text-gray-500 mb-1">{kpi.label}</p>
                      <p className="text-sm font-bold text-white">{kpi.value}</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5">{kpi.delta}</p>
                    </div>
                  ))}
                </div>

                {/* Chart card */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-gray-400 font-medium">Performance</span>
                    <span className="text-[10px] text-blue-400">Last 7 days</span>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[45, 62, 38, 78, 55, 88, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                        className={`flex-1 rounded-t ${
                          i === 5
                            ? "bg-gradient-to-t from-blue-600 to-blue-400"
                            : "bg-blue-500/25"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Activity rows */}
                <div className="space-y-2">
                  {[
                    { w: "w-3/5", c: "bg-emerald-400" },
                    { w: "w-4/5", c: "bg-blue-400" },
                    { w: "w-2/5", c: "bg-cyan-400" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${row.c}`} />
                      <div className={`h-2 rounded-full bg-white/[0.06] ${row.w}`} />
                    </div>
                  ))}
                </div>
              </TiltCard>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-[#0a1628]/95 px-3 py-2 shadow-xl backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none mb-0.5">Lighthouse</p>
                  <p className="text-xs font-bold text-white leading-none">98 / 100</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1.5: Stats strip */}
      <section className="relative border-y border-white/[0.06] bg-[#070f1e]">
        <div className={`${container} py-10`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <CountUp
                  value={stat.value}
                  className="block text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent"
                />
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Layanan Kami */}
      <section className="py-24 bg-[#050b16] relative">
        {/* Subtle ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.04)_0%,transparent_60%)]" />
        </div>

        <div className={`${container} relative z-10`}>
          <div className="flex items-start mb-4">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
              <SectionLabel>{t("services.label")}</SectionLabel>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              {t("services.headline")}
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg self-end leading-relaxed"
            >
              {t("services.description")}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/services"
                  onMouseMove={handleSpotlight}
                  className={`group relative flex flex-col h-full rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    service.popular
                      ? "bg-blue-600/[0.07] border border-blue-500/40 shadow-lg shadow-blue-900/20"
                      : "bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20"
                  }`}
                >
                  {/* Cursor spotlight */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(380px circle at var(--x) var(--y), rgba(56,189,248,0.10), transparent 65%)",
                    }}
                  />
                  {service.popular && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30">
                      <Star className="w-3 h-3 fill-current" />
                      {t("services.popular")}
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${
                      service.popular
                        ? "bg-blue-600/25 border-blue-500/30"
                        : "bg-blue-600/15 border-blue-500/10"
                    }`}
                  >
                    <service.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">{service.desc}</p>
                  <div className="flex justify-end">
                    <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 2.5: Why Vorca — Bento */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-0 w-[600px] h-[500px] bg-[radial-gradient(ellipse,rgba(6,182,212,0.05)_0%,transparent_60%)]" />
        </div>

        <div className={`${container} relative z-10`}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("whyChoose.label")}</SectionLabel>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              {t("whyChoose.headline")}
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg self-end leading-relaxed"
            >
              {t("whyChoose.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[190px]">
            {/* Big: Engineering-first */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onMouseMove={handleSpotlight}
              className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-600/[0.06] p-6 md:col-span-2 md:row-span-2 hover:border-blue-500/30 transition-colors duration-300"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(500px circle at var(--x) var(--y), rgba(56,189,248,0.1), transparent 60%)" }}
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t("whyChoose.engineering.title")}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">{t("whyChoose.engineering.desc")}</p>
              </div>
              {/* Decorative code block */}
              <div className="hidden md:block absolute right-5 bottom-5 left-5 rounded-lg border border-white/[0.06] bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-gray-500 backdrop-blur-sm">
                <p><span className="text-pink-400">const</span> <span className="text-blue-300">app</span> = <span className="text-cyan-300">architect</span>({"{"}</p>
                <p className="pl-4"><span className="text-gray-400">scalable</span>: <span className="text-emerald-400">true</span>,</p>
                <p className="pl-4"><span className="text-gray-400">maintainable</span>: <span className="text-emerald-400">true</span>,</p>
                <p>{"}"});</p>
              </div>
            </motion.div>

            {/* Clean UI */}
            <BentoCell icon={Layers} title={t("whyChoose.cleanUi.title")} desc={t("whyChoose.cleanUi.desc")} delay={0.1} />
            {/* Docs */}
            <BentoCell icon={BookOpen} title={t("whyChoose.docs.title")} desc={t("whyChoose.docs.desc")} delay={0.15} />
            {/* Scalable (wide) */}
            <BentoCell icon={Server} title={t("valuePillars.scalable.title")} desc={t("valuePillars.scalable.desc")} delay={0.2} wide />
            {/* Workflow */}
            <BentoCell icon={Workflow} title={t("valuePillars.workflow.title")} desc={t("valuePillars.workflow.desc")} delay={0.25} />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 3: Proses Kerja */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.06)_0%,transparent_60%)]" />
        </div>

        <div className={`${container} relative z-10`}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("process.label")}</SectionLabel>
          </motion.div>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-20"
          >
            {t("process.headline")}
          </motion.h2>

          {/* Desktop timeline */}
          <div className="hidden md:block">
            {/* Dots row with connecting line (aligned to dot centers) */}
            <div className="relative mb-10">
              {/* base track */}
              <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px -translate-y-1/2 bg-white/[0.08]" />
              {/* animated fill */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px -translate-y-1/2 origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
              />

              <div className="grid grid-cols-4">
                {processSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.3 + i * 0.18, ease: [0.34, 1.56, 0.64, 1] }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-blue-500/15 blur-md" />
                      <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/40 ring-4 ring-[#050b16]">
                        <span className="text-xs font-bold text-white">{step.num}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Step cards */}
            <div className="grid grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                  viewport={{ once: true }}
                  className="group rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 text-center hover:-translate-y-1 hover:border-blue-500/20 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden relative">
            <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-white/[0.06]">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="absolute inset-0 origin-top bg-gradient-to-b from-blue-500/50 to-blue-500/20"
              />
            </div>

            <div className="space-y-8">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="relative flex gap-5"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 ring-4 ring-[#050b16]">
                      <span className="text-xs font-bold text-white">{step.num}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3.5: Testimonials */}
      <section className="py-24 bg-[#070f1e] border-y border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.05)_0%,transparent_60%)]" />
        </div>

        <div className={`${container} relative z-10`}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("testimonials.label")}</SectionLabel>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
            >
              {t("testimonials.headline")}
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg self-end leading-relaxed"
            >
              {t("testimonials.description")}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-blue-500/20 transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-blue-500/30 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{tm.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex items-center justify-center text-sm font-bold text-blue-200 border border-white/[0.08]">
                    {tm.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{tm.name}</p>
                    <p className="text-gray-500 text-xs truncate">{tm.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Teknologi Kami */}
      <section className="py-24 bg-[#050b16] relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.04)_0%,transparent_60%)]" />
        </div>

        <div className={`${container} relative z-10`}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("tech.label")}</SectionLabel>
          </motion.div>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-12"
          >
            {t("tech.headline")}
          </motion.h2>

          <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
            <div className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]">
              {[...techItems, ...techItems].map((tech, i) => (
                <div
                  key={i}
                  aria-hidden={i >= techItems.length}
                  className="w-[230px] shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3 hover:border-blue-500/20 transition-colors duration-300"
                >
                  <div className="w-9 h-9 rounded-md bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.06] p-1.5">
                    <tech.Logo className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {tech.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 5: Portfolio Preview */}
      <section className="py-24 bg-[#050b16] relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.04)_0%,transparent_60%)]" />
        </div>

        <div className={`${container} relative z-10`}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("portfolio.label")}</SectionLabel>
          </motion.div>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-12"
          >
            {t("portfolio.headline")}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {portfolioItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group block rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video bg-[#0a1628] overflow-hidden">
                  <img
                    src={`/portfolio/${item.slug}.jpg`}
                    alt={`Screenshot ${item.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-2 text-sm text-white font-medium px-4 py-2 rounded-lg bg-blue-600/90">
                      {t("portfolio.viewDetail")}
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm"
            >
              {t("portfolio.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 6: CTA Final */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        {/* Stronger blue glow for CTA */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.1)_0%,rgba(37,99,235,0.03)_40%,transparent_70%)]" />
        </div>

        <div className={`${container} relative z-10 text-center`}>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t("cta.headline")}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("cta.description")}
            </p>
            <Button
              asChild
              size="lg"
              className="h-auto rounded-lg px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/20 transition-all duration-300 border-0 gap-2"
            >
              <a
                href="https://wa.me/6285167002152"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="w-5 h-5" />
                {t("hero.cta.dm")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
