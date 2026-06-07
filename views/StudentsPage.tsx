"use client";

import { motion } from "framer-motion";
import { GraduationCap, Clock, CheckCircle, BookOpen, Code, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

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
  return <div className="border-t border-white/[0.06]" />;
}

function AmbientGlow({ position = "center" }: { position?: string }) {
  const posMap: Record<string, string> = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-right": "-top-40 -right-40",
    "bottom-left": "-bottom-40 -left-40",
  };
  return (
    <div className={`absolute ${posMap[position]} w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none`} />
  );
}

export default function StudentsPage() {
  const { t } = useLanguage();

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

  const services = [
    {
      icon: Code,
      title: t("students.webDevProjects"),
      description: t("students.webDevProjects.desc"),
      priceIdr: 500000,
      discountPercent: 15,
      features: ["HTML/CSS/JavaScript", "React/Vue.js", "Backend Integration", "Responsive Design"],
      duration: "3–7 hari",
      popular: true
    },
    {
      icon: Palette,
      title: t("students.uiuxDesign"),
      description: t("students.uiuxDesign.desc"),
      priceIdr: 300000,
      discountPercent: 10,
      features: ["Wireframes", "Mockups", "Prototypes", "Design Systems"],
      duration: "2–5 hari",
      popular: false
    },
    {
      icon: BookOpen,
      title: t("students.programmingAssignments"),
      description: t("students.programmingAssignments.desc"),
      priceIdr: 200000,
      discountPercent: 10,
      features: ["Python/Java/C++", "Data Structures", "Algorithms", "Code Documentation"],
      duration: "1–3 hari",
      popular: false
    }
  ];

  const process = [
    {
      step: "01",
      title: t("students.submitBrief"),
      description: t("students.submitBrief.desc")
    },
    {
      step: "02",
      title: t("students.freeConsultation"),
      description: t("students.freeConsultation.desc")
    },
    {
      step: "03",
      title: t("students.development"),
      description: t("students.development.desc")
    },
    {
      step: "04",
      title: t("students.explanation"),
      description: t("students.explanation.desc")
    }
  ];

  const benefits = [
    t("students.affordablePricing"),
    t("students.quickTurnaround"),
    t("students.highQuality"),
    t("students.codeExplanation"),
    t("students.revisionSupport"),
    t("students.communication")
  ];

  return (
    <div className="pt-16 bg-[#050b16]">
      <PageHero
        title={
          <>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent">
                {t("students.title")}
              </span>
            </h1>
          </>
        }
        subtitle={t("students.subtitle")}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300"
          >
            <a href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website." target="_blank" rel="noopener noreferrer">
              {t("students.consultation")}
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-auto relative group overflow-hidden bg-transparent !bg-transparent !shadow-none border border-white/[0.06] text-blue-400 px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/20 hover:bg-white/[0.02]"
          >
            <a href="#pricing">
              {t("students.pricing")}
            </a>
          </Button>
        </div>
      </PageHero>

      <SectionDivider />

      {/* Benefits Section */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <AmbientGlow position="top-right" />
        <div className={container}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("students.benefits.label")}</SectionLabel>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("students.whyChoose")}
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl">
              {t("students.whyChoose.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Services Section */}
      <section id="pricing" className="py-24 bg-[#050b16] relative overflow-hidden">
        <AmbientGlow position="bottom-left" />
        <div className={container}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("students.pricing.label")}</SectionLabel>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("students.servicesAndPricing")}
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl">
              {t("students.servicesAndPricing.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className={`h-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20 ${service.popular ? 'ring-2 ring-blue-500/30 border-blue-500/20' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white font-semibold px-4 py-1">
                        {t("services.mostPopular")}
                      </Badge>
                    </div>
                  )}
                  {service.discountPercent > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1 backdrop-blur-sm">
                        -{service.discountPercent}%
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-lg text-white">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {service.discountPercent > 0 && (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              Mulai dari {formatRupiah(service.priceIdr)}
                            </div>
                            <div className="text-xs text-emerald-400">
                              Hemat {formatRupiah(service.priceIdr - Math.round(service.priceIdr * (1 - (service.discountPercent ?? 0) / 100)))}
                            </div>
                          </>
                        )}
                        <div className="text-2xl font-bold text-blue-400">
                          Mulai dari {formatRupiah(Math.round(service.priceIdr * (1 - (service.discountPercent ?? 0) / 100)))}
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center bg-white/[0.02] text-gray-400 border border-white/[0.06]">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration}
                      </Badge>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 border-0 shadow-lg shadow-blue-600/20"
                    >
                      <Link href="/contact">
                        {t("services.getStarted")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Process Section */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <AmbientGlow position="center" />
        <div className={container}>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
            <SectionLabel>{t("students.process.label")}</SectionLabel>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("students.howItWorks")}
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl">
              {t("students.howItWorks.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/30 flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ Section */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <AmbientGlow position="top-right" />
        <div className={container}>
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4">
              <SectionLabel>{t("students.faq.label")}</SectionLabel>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {t("students.faq")}
              </h2>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: "Do you guarantee good grades?",
                  answer: "While we can't guarantee grades (as that depends on your professor's evaluation), we ensure high-quality work that meets academic standards and provide thorough explanations so you understand the project completely."
                },
                {
                  question: "How do you ensure I understand the work?",
                  answer: "Every project includes a detailed explanation session where we walk through the code/design, explain the concepts used, and answer any questions you have."
                },
                {
                  question: "What if I need revisions?",
                  answer: "We include reasonable revisions in our pricing. If your professor requests changes or you need modifications, we'll work with you to make them."
                },
                {
                  question: "Is this considered cheating?",
                  answer: "We provide educational assistance and tutoring. It's your responsibility to use our work according to your institution's academic integrity policies. We recommend using our work as a learning reference."
                },
                {
                  question: "How quickly can you complete my project?",
                  answer: "Turnaround times vary based on complexity. Simple assignments can be completed in 1-2 days, while complex projects may take up to a week. We always respect your deadlines."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-base font-semibold text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        </div>

        <div className={`${container} relative z-10 text-center`}>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("students.readyToAce")}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              {t("students.readyToAce.desc")}
            </p>
            <Button
              asChild
              size="lg"
              className="h-auto rounded-xl px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 border-0"
            >
              <a href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website." target="_blank" rel="noopener noreferrer">
                {t("students.startFreeConsultation")}
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
