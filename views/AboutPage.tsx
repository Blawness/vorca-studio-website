"use client";

import { motion } from "framer-motion";
import { Target, Zap, Users, Shield } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: t("about.precision"),
      description: t("about.precision.desc")
    },
    {
      icon: Zap,
      title: t("about.power"),
      description: t("about.power.desc")
    },
    {
      icon: Users,
      title: t("about.collaboration"),
      description: t("about.collaboration.desc")
    },
    {
      icon: Shield,
      title: t("about.ownership"),
      description: t("about.ownership.desc")
    }
  ];

  const team = [
    {
      name: "Yudha Hafiz",
      role: t("about.team.yudha.role"),
      image: "https://i.imgur.com/mosP5lg_d.png?maxwidth=520&shape=thumb&fidelity=high",
      bio: t("about.team.yudha.bio")
    }
  ];

  const stats = [
    { label: "Klien dari berbagai industri" },
    { label: "Puluhan proyek web & web app" },
    { label: "Beberapa tahun pengalaman" },
    { label: "Fokus pada kualitas & maintainability" },
  ];

  const storyHighlights = [
    "Studio teknologi yang lahir dari kebutuhan bisnis nyata.",
    "Tim kecil yang dekat dengan founder dan stakeholder.",
    "Eksekusi rapi dengan dokumentasi dan handover yang jelas."
  ];

  return (
    <div className="bg-[#050b16]">
      <PageHero
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* Story + Why Orca */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-blue-900/10 to-transparent blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 relative space-y-16">
          {/* Story about Vorca Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 lg:p-10 shadow-[0_20px_80px_-30px_rgba(0,120,255,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-cyan-500/10" />
                <div className="absolute -right-16 -top-24 h-56 w-56 bg-cyan-500/20 blur-3xl" />

                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-sm text-cyan-300/90">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Cerita awal Vorca Studio
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white max-w-2xl">
                      Kami lahir untuk merapikan teknologi bisnis Anda
                    </h2>
                    <div className="space-y-3 text-slate-300/90 leading-relaxed max-w-3xl">
                      <p>
                        Vorca Studio bermula dari keresahan melihat produk digital yang sulit dirawat.
                        Kami membangun tim inti yang terbiasa bekerja dekat dengan founder.
                      </p>
                      <p>
                        Dengan komunikasi yang rapat sejak hari pertama, keputusan teknis dan bisnis bisa
                        berjalan serarah dan siap dipelihara jangka panjang.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {storyHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                          {idx + 1}
                        </div>
                        <p className="text-slate-200/90 text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_60px_-20px_rgba(0,140,255,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050b16]/60 via-transparent to-cyan-500/10 pointer-events-none" />
                <img
                  src="https://i.imgur.com/zbGukz9.png"
                  alt="Orca whale swimming"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/40 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-200/80">Vorca Studio</p>
                    <p className="text-white font-semibold text-lg leading-tight">Membangun produk digital yang tahan lama</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-cyan-200 text-sm font-semibold">
                    VS
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Why Orca */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-[0_20px_80px_-30px_rgba(0,120,255,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-500/10" />
                <div className="absolute -left-10 -bottom-12 h-44 w-44 bg-blue-500/15 blur-3xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-sm text-cyan-300/90 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Mengapa Orca?
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
                    {t("about.whyOrca")}
                  </h2>
                  <div className="space-y-4 text-slate-300/90 leading-relaxed">
                    <p>
                      {t("about.whyOrca.desc1")}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300/80 ml-2">
                      <li>kami pelajari konteks bisnis,</li>
                      <li>kami rancang arsitektur sistemnya,</li>
                      <li>kami eksekusi secara fokus hingga siap dipakai.</li>
                    </ul>
                    <div className="pt-4">
                      <p className="text-cyan-400 font-medium italic">
                        "{t("about.mission")}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_60px_-20px_rgba(0,140,255,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050b16]/20 to-[#050b16]/70 pointer-events-none" />
                <img
                  src="https://images.unsplash.com/photo-1669707355372-b2d1e31dc083?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Orca whale swimming in the ocean"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs border border-white/10">Kolaborasi pod</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-100 text-xs border border-cyan-500/20">Focus & agile</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-white/5 mx-auto w-full max-w-6xl" />

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              {t("about.ourValues")}
            </h2>
            <p className="text-slate-300/70 max-w-2xl mx-auto">
              {t("about.ourValues.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-cyan-400 to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,150,255,0.3)]">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-300/80 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-white/5 mx-auto w-full max-w-6xl" />

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Dibalik Layar Vorca Studio
            </h2>
            <p className="text-slate-300/70 max-w-2xl mx-auto">
              {t("about.meetOurPod.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto place-items-center">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="relative mb-5 mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-40 md:w-40 md:h-52 rounded-2xl object-cover border border-white/10 shadow-[0_10px_40px_-18px_rgba(0,200,255,0.45)]"
                    />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-cyan-400 text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-300/80 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-white/5 mx-auto w-full max-w-6xl" />

      {/* Stats/Track Record Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Track Record
            </h2>
          </motion.div>

          {/* Vertical Roadmap */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-transparent" />

            <div className="space-y-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-6"
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,150,255,0.4)]">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-colors duration-300">
                    <p className="text-slate-200 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
