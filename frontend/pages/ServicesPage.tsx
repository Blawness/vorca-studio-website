import { motion } from "framer-motion";
import {
  Globe,
  Database,
  Code,
  Cpu,
  Palette,
  Zap,
  Wrench,
  Gauge,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

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

  const designServices = [
    {
      icon: Palette,
      title: t("services.uiux.title"),
      description: t("services.uiux.description"),
      features: [],
    },
    {
      icon: Zap,
      title: t("services.branding.title"),
      description: t("services.branding.description"),
      features: t("services.branding.features").split(", "),
    },
  ];

  const maintenanceServices = [
    {
      icon: Wrench,
      title: t("services.maintenance.web.title"),
      features: t("services.maintenance.web.features").split(", "),
    },
    {
      icon: Gauge,
      title: t("services.maintenance.perf.title"),
      features: t("services.maintenance.perf.features").split(", "),
    },
  ];

  const addons = t("services.addons.list").split(", ");

  return (
    <div className="pt-16 bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                {t("services.title")}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t("services.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("services.core.title")}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("services.core.desc")}</p>
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
                <Card className="h-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                      <service.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-6">{service.description}</p>
                    {service.features.length > 0 && (
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 mr-2 mt-0.5 shrink-0" />
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
      </section>

      {/* Design & Branding */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("services.design.title")}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("services.design.desc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {designServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-black/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-6">{service.description}</p>
                    {service.features.length > 0 && (
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1.5 shrink-0"></div>
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

      </section>

      {/* Maintenance & Support */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("services.maintenance.title")}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("services.maintenance.desc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {maintenanceServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gray-900 border-gray-800 hover:border-green-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">{t("services.addons.title")}</h3>
            <p className="text-gray-400">{t("services.addons.desc")}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {addons.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700 rounded-full px-6 py-3 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default"
              >
                {addon}
              </motion.div>
            ))}
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
                <a href="https://wa.me/6285167002152" target="_blank" rel="noopener noreferrer">
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
