"use client";

import { motion } from "framer-motion";
import { Globe, Database, Code, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

export default function ServicesPage() {
  const { t } = useLanguage();

  const coreServices = [
    {
      icon: Globe,
      title: t("services.web.title"),
      description: t("services.web.description"),
      features: t("services.web.features").split(", "),
    },
    {
      icon: Database,
      title: t("services.apps.title"),
      description: t("services.apps.description"),
      features: t("services.apps.features").split(", "),
    },
    {
      icon: Code,
      title: t("services.frontend.title"),
      description: t("services.frontend.description"),
      features: [],
    },
    {
      icon: Cpu,
      title: t("services.system.title"),
      description: t("services.system.description"),
      features: [],
    },
  ];

  return (
    <div className="pt-16 bg-black min-h-screen">
      <PageHero
        title={t("services.title")}
        subtitle={t("services.subtitle")}
      />

      {/* Core Services */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020712] via-[#060f20] to-black" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-24 -top-24 h-72 w-72 bg-cyan-500/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 bg-blue-600/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_90px_-35px_rgba(0,140,255,0.45)] p-8 lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-500/10" />
            <div className="relative">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("services.core.title")}</h2>
                <p className="text-gray-300/90 max-w-2xl mx-auto">{t("services.core.desc")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {coreServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="h-full bg-gradient-to-br from-[#0b1526] to-[#0f1c33] border border-white/10 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-[0_18px_80px_-32px_rgba(0,220,255,0.55)]">
                      <CardHeader>
                        <div className="w-12 h-12 bg-cyan-500/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/25 transition-colors shadow-[0_10px_30px_-18px_rgba(0,200,255,0.6)]">
                          <service.icon className="w-6 h-6 text-cyan-300" />
                        </div>
                        <CardTitle className="text-2xl text-white">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-6">{service.description}</p>
                        {service.features.length > 0 && (
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-200">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {t("common.readyToDominate")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="h-auto rounded-2xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border-0"
              >
                <a href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website." target="_blank" rel="noopener noreferrer">
                  {t("services.cta.discuss")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
