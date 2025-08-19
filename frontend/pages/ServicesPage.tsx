import { motion } from "framer-motion";
import { Code, Palette, Zap, Server, Smartphone, Search, Shield, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      price: "Starting from $1,500",
      popular: true
    },
    {
      icon: Palette,
      title: t("services.uiux.title"),
      description: t("services.uiux.description"),
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      price: "Starting from $800",
      popular: false
    },
    {
      icon: Zap,
      title: t("services.branding.title"),
      description: t("services.branding.description"),
      features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Materials"],
      price: "Starting from $600",
      popular: false
    },
    {
      icon: Server,
      title: t("services.webHosting"),
      description: t("services.webHosting.desc"),
      features: ["99.9% Uptime", "SSL Certificates", "Daily Backups", "24/7 Support"],
      price: "Starting from $10/month",
      popular: false
    },
    {
      icon: Smartphone,
      title: t("services.mobileApps"),
      description: t("services.mobileApps.desc"),
      features: ["iOS & Android", "React Native", "App Store Deployment", "Push Notifications"],
      price: "Starting from $3,000",
      popular: false
    },
    {
      icon: Search,
      title: t("services.seoOptimization"),
      description: t("services.seoOptimization.desc"),
      features: ["Keyword Research", "On-page SEO", "Technical SEO", "Analytics Setup"],
      price: "Starting from $400",
      popular: false
    },
    {
      icon: Shield,
      title: t("services.securityAudit"),
      description: t("services.securityAudit.desc"),
      features: ["Vulnerability Scanning", "Security Hardening", "SSL Implementation", "Monitoring"],
      price: "Starting from $500",
      popular: false
    },
    {
      icon: Headphones,
      title: t("services.maintenanceSupport"),
      description: t("services.maintenanceSupport.desc"),
      features: ["Regular Updates", "Bug Fixes", "Performance Monitoring", "Content Updates"],
      price: "Starting from $200/month",
      popular: false
    }
  ];

  return (
    <div className="pt-16 bg-black">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                {t("services.title")}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className={`h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 ${
                  service.popular ? 'ring-2 ring-cyan-500/50' : ''
                }`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold px-4 py-1">
                        {t("services.mostPopular")}
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
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-lg font-semibold text-cyan-400 mb-4">
                      {service.price}
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all duration-300"
                    >
                      <Link to="/contact">
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
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              {t("services.ourProcess")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("services.ourProcess.desc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: t("services.discovery"), description: t("services.discovery.desc") },
              { step: "02", title: t("services.strategy"), description: t("services.strategy.desc") },
              { step: "03", title: t("services.development"), description: t("services.development.desc") },
              { step: "04", title: t("services.launch"), description: t("services.launch.desc") }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-black rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {process.title}
                </h3>
                <p className="text-gray-400">
                  {process.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
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
              {t("services.readyToStart")}
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              {t("services.readyToStart.desc")}
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <Link to="/contact">
                {t("services.getFreeConsultation")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
