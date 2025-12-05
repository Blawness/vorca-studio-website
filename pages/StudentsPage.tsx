"use client";

import { motion } from "framer-motion";
import { GraduationCap, Clock, DollarSign, CheckCircle, BookOpen, Code, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

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
    <div className="pt-16 bg-black">
      <PageHero
        title={
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
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
            className="rounded-2xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
          >
            <a href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website." target="_blank" rel="noopener noreferrer">
              {t("students.consultation")}
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-auto relative group overflow-hidden bg-transparent !bg-transparent !shadow-none border border-cyan-400/30 text-cyan-300 px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_rgba(34,211,238,0.15)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/8 before:to-white/0 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-black"
          >
            <a href="#pricing">
              {t("students.pricing")}
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              {t("students.whyChoose")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("students.whyChoose.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              {t("students.servicesAndPricing")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("students.servicesAndPricing.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className={`h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 ${service.popular ? 'ring-2 ring-cyan-500/50' : ''
                  }`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold px-4 py-1">
                        {t("services.mostPopular")}
                      </Badge>
                    </div>
                  )}
                  {service.discountPercent > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-1 backdrop-blur-sm">
                        -{service.discountPercent}%
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                      <service.icon className="w-6 h-6 text-black" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {service.discountPercent > 0 && (
                          <>
                            <div className="text-sm text-gray-400 line-through">
                              Mulai dari {formatRupiah(service.priceIdr)}
                            </div>
                            <div className="text-xs text-emerald-300">
                              Hemat {formatRupiah(service.priceIdr - Math.round(service.priceIdr * (1 - (service.discountPercent ?? 0) / 100)))}
                            </div>
                          </>
                        )}
                        <div className="text-2xl font-bold text-cyan-400">
                          Mulai dari {formatRupiah(Math.round(service.priceIdr * (1 - (service.discountPercent ?? 0) / 100)))}
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center bg-gray-700/50 text-gray-300">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration}
                      </Badge>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all duration-300"
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

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              {t("students.howItWorks")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("students.howItWorks.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-black rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              {t("students.faq")}
            </h2>
          </motion.div>

          <div className="space-y-6">
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-400">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              {t("students.readyToAce")}
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              {t("students.readyToAce.desc")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
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
