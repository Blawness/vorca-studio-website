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
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&h=300&fit=crop&crop=face",
      bio: t("about.team.yudha.bio")
    },
    {
      name: "Andhika Satya",
      role: t("about.team.andhika.role"),
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=300&h=300&fit=crop&crop=face",
      bio: t("about.team.andhika.bio")
    }
  ];

  const stats = [
    { label: "Klien dari berbagai industri" },
    { label: "Puluhan proyek web & web app" },
    { label: "Beberapa tahun pengalaman" },
    { label: "Fokus pada kualitas & maintainability" },
  ];

  return (
    <div className="bg-[#050b16]">
      <PageHero
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* Why Orca Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
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
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,140,255,0.3)]">
                <img
                  src="https://i.imgur.com/Zn2Ylgo.png"
                  alt="Orca whale swimming"
                  className="w-full h-80 lg:h-96 object-cover"
                />
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
              {t("about.meetOurPod")}
            </h2>
            <p className="text-slate-300/70 max-w-2xl mx-auto">
              {t("about.meetOurPod.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-2 ring-cyan-500/30"
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
