import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Code, Palette, Zap, Users, Award, TrendingUp, Sparkles, Rocket, Shield,
  Layers, Server, Workflow, Database, Cpu, Layout, BookOpen, CheckCircle, Terminal, Globe, Smartphone, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

export default function HomePage() {
  const { t } = useLanguage();
  const title = t("hero.title");

  const valuePillars = [
    {
      icon: Layers,
      title: t("valuePillars.fullStack.title"),
      description: t("valuePillars.fullStack.desc"),
    },
    {
      icon: Server,
      title: t("valuePillars.scalable.title"),
      description: t("valuePillars.scalable.desc"),
    },
    {
      icon: Workflow,
      title: t("valuePillars.workflow.title"),
      description: t("valuePillars.workflow.desc"),
    },
  ];

  const coreServices = [
    {
      icon: Globe,
      title: t("services.web.title"),
      description: t("services.web.description"),
    },
    {
      icon: Layout,
      title: t("services.apps.title"),
      description: t("services.apps.description"),
    },
    {
      icon: Code,
      title: t("services.frontend.title"),
      description: t("services.frontend.description"),
    },

  ];

  const techStack = [
    "Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma ORM", "MySQL / PostgreSQL", "REST API", "VPS / Cloud Deployment"
  ];

  const systemTypes = [
    t("systemTypes.data"),
    t("systemTypes.reservation"),
    t("systemTypes.crm"),
    t("systemTypes.inventory"),
    t("systemTypes.hris"),
    t("systemTypes.kpi"),
    t("systemTypes.ticket"),
    t("systemTypes.workflow"),
  ];

  const whyChoose = [
    {
      icon: Terminal,
      title: t("whyChoose.engineering.title"),
      description: t("whyChoose.engineering.desc"),
    },
    {
      icon: Palette,
      title: t("whyChoose.cleanUi.title"),
      description: t("whyChoose.cleanUi.desc"),
    },
    {
      icon: BookOpen,
      title: t("whyChoose.docs.title"),
      description: t("whyChoose.docs.desc"),
    },
  ];

  return (
    <div>
      <PageHero
        title={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-sm text-cyan-300 font-medium">{t("common.nextGen")}</span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {Array.from(title.replace(" End-to-End", "\nEnd-to-End")).map((char, i) => (
                char === "\n" ? (
                  <br key={`br-${i}`} />
                ) : (
                  <motion.span
                    key={`${char}-${i}`}
                    initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                    className="inline-block bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent will-change-transform will-change-opacity"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                )
              ))}
            </h1>
          </>
        }
        subtitle={t("hero.subtitle")}
      >
        <p className="text-lg mb-8 text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {t("hero.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="h-auto rounded-2xl px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border-0"
          >
            <Link to="/contact">
              {t("hero.cta")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-auto relative group overflow-hidden bg-transparent !bg-transparent !shadow-none border border-cyan-400/30 text-cyan-200 px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_rgba(34,211,238,0.15)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/8 before:to-white/0 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-black"
          >
            <a href="https://wa.me/6285167002152" target="_blank" rel="noopener noreferrer">
              {t("hero.consultation")}
            </a>
          </Button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center relative z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyan-400/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </PageHero>

      {/* Value Pillars Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuePillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                      <pillar.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-400">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("services.title")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                      <service.icon className="w-7 h-7 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("techStack.title")}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t("techStack.description")}</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-6 py-3 rounded-full bg-gray-800/50 border border-gray-700 text-cyan-300 font-medium hover:bg-gray-700/50 hover:border-cyan-500/50 transition-colors cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Types Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">{t("systemTypes.title")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {systemTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm font-medium">{type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("whyChoose.title")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                  <item.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {t("cta.description")}
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-auto rounded-2xl px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 border-0"
              >
                <Link to="/contact">
                  {t("cta.button")}
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
