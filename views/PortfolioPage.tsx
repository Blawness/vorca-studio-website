"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
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

export default function PortfolioPage() {
  const { t } = useLanguage();

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with advanced features",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      category: t("portfolio.webDevelopment"),
      results: ["300% increase in sales", "50% faster load times", "99.9% uptime"],
      link: "#",
      github: "#"
    },
    {
      title: "Healthcare Dashboard",
      description: "Comprehensive patient management system",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      tags: ["Vue.js", "Express", "MongoDB", "Chart.js"],
      category: t("portfolio.uiuxDesign"),
      results: ["40% reduction in admin time", "Improved patient satisfaction", "HIPAA compliant"],
      link: "#",
      github: "#"
    },
    {
      title: "FinTech Mobile App",
      description: "Secure financial management application",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["React Native", "Firebase", "Plaid API", "Biometrics"],
      category: t("portfolio.mobileDevelopment"),
      results: ["10k+ downloads", "4.8 app store rating", "Bank-level security"],
      link: "#",
      github: "#"
    },
    {
      title: "Restaurant Chain Website",
      description: "Multi-location restaurant website with online ordering",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
      tags: ["Next.js", "Tailwind", "Sanity CMS", "Stripe"],
      category: t("portfolio.webDevelopment"),
      results: ["200% increase in online orders", "Mobile-first design", "SEO optimized"],
      link: "#",
      github: "#"
    },
    {
      title: "SaaS Analytics Platform",
      description: "Real-time analytics dashboard for businesses",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["React", "D3.js", "Python", "AWS"],
      category: t("portfolio.webDevelopment"),
      results: ["Real-time data processing", "Custom visualizations", "Scalable architecture"],
      link: "#",
      github: "#"
    },
    {
      title: "Educational Platform",
      description: "Online learning platform with interactive courses",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      tags: ["Angular", "NestJS", "PostgreSQL", "WebRTC"],
      category: t("portfolio.webDevelopment"),
      results: ["5000+ active students", "Interactive video lessons", "Progress tracking"],
      link: "#",
      github: "#"
    }
  ];

  const categories = [
    t("portfolio.all"),
    t("portfolio.webDevelopment"),
    t("portfolio.uiuxDesign"),
    t("portfolio.mobileDevelopment"),
    t("portfolio.branding")
  ];

  return (
    <div className="pt-16 bg-[#050b16]">
      <PageHero
        eyebrow={t("portfolio.label")}
        title={t("portfolio.title")}
        subtitle={t("portfolio.subtitle")}
      />

      <SectionDivider />

      {/* Filter Tabs */}
      <section className="relative py-8 bg-[#050b16] border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-4 text-center">
            <SectionLabel>{t("portfolio.categories")}</SectionLabel>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className={
                  index === 0
                    ? "rounded-full px-5 py-2.5 bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all duration-300"
                    : "rounded-full px-5 py-2.5 bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:bg-white/[0.05] hover:text-white transition-all duration-300"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Projects Grid */}
      <section className="relative py-20 bg-[#050b16]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
            <SectionLabel>{t("portfolio.projects")}</SectionLabel>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20 overflow-hidden">
                  <div className="relative group/image">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.dataset.fallbackApplied === "true") return;
                        target.dataset.fallbackApplied = "true";
                        target.src = "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg";
                      }}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover/image:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t("portfolio.view")}
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          {t("portfolio.code")}
                        </a>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-blue-600/15 text-blue-400 border border-blue-500/10 font-semibold">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs bg-white/[0.04] text-gray-400 border border-white/[0.06]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-blue-400">{t("portfolio.results")}</h4>
                      {project.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                          {result}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
            <h2 className="text-5xl font-bold text-white mb-6">
              {t("portfolio.readyToCreate")}
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              {t("portfolio.readyToCreate.desc")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-300"
            >
              <a href="/contact">
                {t("portfolio.startYourProject")}
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
