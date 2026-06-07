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
  Wind,
  Triangle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";

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
    },
    {
      icon: Building,
      title: t("services.company.title"),
      desc: t("services.company.desc"),
    },
    {
      icon: Grid3x3,
      title: t("services.webapp.title"),
      desc: t("services.webapp.desc"),
    },
  ];

  const processSteps = [
    { num: "01", title: t("process.step1.title"), desc: t("process.step1.desc") },
    { num: "02", title: t("process.step2.title"), desc: t("process.step2.desc") },
    { num: "03", title: t("process.step3.title"), desc: t("process.step3.desc") },
    { num: "04", title: t("process.step4.title"), desc: t("process.step4.desc") },
  ];

  const techItems = [
    { label: "N", name: "Next.js", desc: t("tech.nextjs.label"), icon: null },
    { label: "TS", name: "TypeScript", desc: t("tech.typescript.label"), icon: null },
    { label: "", name: "Tailwind CSS", desc: t("tech.tailwind.label"), icon: Wind },
    { label: "", name: "Vercel", desc: t("tech.vercel.label"), icon: Triangle },
    { label: "", name: "Supabase", desc: t("tech.supabase.label"), icon: Zap },
  ];

  const portfolioItems = [
    { title: "E-Commerce Platform", category: "Web App" },
    { title: "Company Profile — PT Maju Jaya", category: "Website" },
    { title: "Dashboard Analytics", category: "Web App" },
  ];

  return (
    <div className="bg-[#050b16]">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background lighting */}
        <div className="absolute inset-0 bg-[#050b16]">
          {/* Main blue spotlight behind laptop area (right side) */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[900px] h-[900px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.15)_0%,rgba(37,99,235,0.05)_40%,transparent_70%)]" />
          {/* Subtle ambient blue from top */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_60%)]" />
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
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              >
                Membangun Web, Menggerakkan{" "}
                <span className="text-blue-500">Bisnis</span> Anda.
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
              >
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
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block"
            >
              {/* Blue glow behind laptop */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.2)_0%,transparent_60%)] pointer-events-none" />
              <div className="relative bg-[#0a1628]/80 rounded-xl border border-blue-500/10 aspect-[4/3] p-5 shadow-2xl shadow-blue-900/20 backdrop-blur-sm">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <div className="ml-3 flex-1 h-5 bg-white/[0.04] rounded-md" />
                </div>
                {/* Dashboard mockup content */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-1/3 h-16 bg-blue-500/15 rounded-lg border border-blue-500/10" />
                    <div className="w-1/3 h-16 bg-cyan-500/10 rounded-lg border border-cyan-500/10" />
                    <div className="w-1/3 h-16 bg-blue-400/10 rounded-lg border border-blue-400/10" />
                  </div>
                  <div className="h-12 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                  <div className="flex gap-3">
                    <div className="w-2/3 h-20 bg-white/[0.03] rounded-lg border border-white/[0.05]" />
                    <div className="w-1/3 h-20 bg-blue-500/10 rounded-lg border border-blue-500/10" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/4 h-8 bg-blue-500/20 rounded border border-blue-500/20" />
                    <div className="w-1/4 h-8 bg-white/[0.03] rounded border border-white/[0.05]" />
                    <div className="w-1/4 h-8 bg-white/[0.03] rounded border border-white/[0.05]" />
                  </div>
                </div>
                {/* Placeholder label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 text-xs font-medium bg-[#0a1628]/90 px-3 py-1.5 rounded-md border border-white/[0.06]">
                    Your screenshot here
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

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
                className="group bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:-translate-y-1 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-600/15 rounded-lg flex items-center justify-center mb-4 border border-blue-500/10">
                  <service.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{service.desc}</p>
                <div className="flex justify-end">
                  <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </motion.div>
            ))}
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
          <div className="hidden md:block relative">
            {/* Animated progress line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="absolute top-5 left-[10%] right-[10%] h-[2px] origin-left"
              style={{
                background: "linear-gradient(90deg, rgba(59,130,246,0.6) 0%, rgba(96,165,250,0.3) 50%, rgba(59,130,246,0.6) 100%)",
              }}
            />
            {/* Glow line underneath */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="absolute top-[18px] left-[10%] right-[10%] h-[4px] origin-left blur-md"
              style={{
                background: "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(96,165,250,0.1) 50%, rgba(59,130,246,0.3) 100%)",
              }}
            />

            <div className="grid grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
                  viewport={{ once: true }}
                  className="relative text-center group"
                >
                  {/* Glowing dot */}
                  <div className="relative mx-auto mb-8">
                    {/* Outer pulse ring */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                      viewport={{ once: true }}
                      className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"
                      style={{ animationDuration: "3s", animationDelay: `${i * 0.5}s` }}
                    />
                    {/* Glow ring */}
                    <div className="absolute -inset-2 rounded-full bg-blue-500/10 blur-md" />
                    {/* Main dot */}
                    <div className="relative w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/40 ring-4 ring-[#050b16]">
                      <span className="text-xs font-bold text-white">{step.num}</span>
                    </div>
                  </div>

                  {/* Step card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-blue-500/20 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
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

      <SectionDivider />

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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {techItems.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3 hover:border-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                {tech.icon ? (
                  <tech.icon className="w-6 h-6 text-blue-400 shrink-0" />
                ) : (
                  <div className="w-8 h-8 bg-blue-600/15 rounded-md flex items-center justify-center shrink-0 border border-blue-500/10">
                    <span className="text-xs font-bold text-blue-400">
                      {tech.label}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {tech.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="relative aspect-video bg-[#0a1628] rounded-t-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300">
                    <span className="text-sm text-white font-medium px-4 py-2 rounded-lg bg-blue-600/80">
                      {t("portfolio.viewDetail")}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                </div>
              </motion.div>
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
