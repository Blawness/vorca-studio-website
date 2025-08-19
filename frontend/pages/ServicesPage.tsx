import { motion } from "framer-motion";
import { Code, Palette, Zap, Server, Smartphone, Search, Shield, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Code,
      title: t("services.web.title"),
      description: t("services.web.description"),
      features: ["Responsive Design", "Performance Optimization", "Modern Frameworks", "SEO Ready"],
      price: "Starting from $1,500"
    },
    {
      icon: Palette,
      title: t("services.uiux.title"),
      description: t("services.uiux.description"),
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      price: "Starting from $800"
    },
    {
      icon: Zap,
      title: t("services.branding.title"),
      description: t("services.branding.description"),
      features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Materials"],
      price: "Starting from $600"
    },
    {
      icon: Server,
      title: "Web Hosting",
      description: "Reliable and secure hosting solutions",
      features: ["99.9% Uptime", "SSL Certificates", "Daily Backups", "24/7 Support"],
      price: "Starting from $10/month"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications",
      features: ["iOS & Android", "React Native", "App Store Deployment", "Push Notifications"],
      price: "Starting from $3,000"
    },
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Improve your search engine rankings",
      features: ["Keyword Research", "On-page SEO", "Technical SEO", "Analytics Setup"],
      price: "Starting from $400"
    },
    {
      icon: Shield,
      title: "Security Audit",
      description: "Comprehensive security assessment and protection",
      features: ["Vulnerability Scanning", "Security Hardening", "SSL Implementation", "Monitoring"],
      price: "Starting from $500"
    },
    {
      icon: Headphones,
      title: "Maintenance & Support",
      description: "Ongoing website maintenance and technical support",
      features: ["Regular Updates", "Bug Fixes", "Performance Monitoring", "Content Updates"],
      price: "Starting from $200/month"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#001F3F] to-[#002a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("services.title")}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#001F3F] rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-[#001F3F]">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-[#001F3F] rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-lg font-semibold text-[#001F3F] mb-4">
                      {service.price}
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/contact">
                        Get Started
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#001F3F] mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined approach to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your needs and goals" },
              { step: "02", title: "Strategy", description: "Planning the perfect solution" },
              { step: "03", title: "Development", description: "Building with precision and care" },
              { step: "04", title: "Launch", description: "Deploying and optimizing for success" }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#001F3F] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-[#001F3F] mb-2">
                  {process.title}
                </h3>
                <p className="text-gray-600">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#001F3F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can help you achieve your digital goals.
            </p>
            <Button asChild size="lg" className="bg-white text-[#001F3F] hover:bg-gray-100">
              <Link to="/contact">
                Get Free Consultation
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
