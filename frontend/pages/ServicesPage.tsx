import { motion } from "framer-motion";
import { Code, Palette, Zap, Server, Smartphone, Search, Shield, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

  const services = [
    {
      icon: Code,
      title: t("services.web.title"),
      description: t("services.web.description"),
      features: ["Responsive Design", "Performance Optimization", "Modern Frameworks", "SEO Ready"],
      priceIdr: 15000000,
      monthly: false,
      discountPercent: 20,
      popular: true
    },
    {
      icon: Palette,
      title: t("services.uiux.title"),
      description: t("services.uiux.description"),
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      priceIdr: 8000000,
      monthly: false,
      discountPercent: 10,
      popular: false
    },
    {
      icon: Zap,
      title: t("services.branding.title"),
      description: t("services.branding.description"),
      features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Materials"],
      priceIdr: 6000000,
      monthly: false,
      discountPercent: 12,
      popular: false
    },
    {
      icon: Server,
      title: t("services.webHosting"),
      description: t("services.webHosting.desc"),
      features: ["99.9% Uptime", "SSL Certificates", "Daily Backups", "24/7 Support"],
      priceIdr: 150000,
      monthly: true,
      discountPercent: 0,
      popular: false
    },
    {
      icon: Smartphone,
      title: t("services.mobileApps"),
      description: t("services.mobileApps.desc"),
      features: ["iOS & Android", "React Native", "App Store Deployment", "Push Notifications"],
      priceIdr: 30000000,
      monthly: false,
      discountPercent: 15,
      popular: false
    },
    {
      icon: Search,
      title: t("services.seoOptimization"),
      description: t("services.seoOptimization.desc"),
      features: ["Keyword Research", "On-page SEO", "Technical SEO", "Analytics Setup"],
      priceIdr: 4000000,
      monthly: false,
      discountPercent: 10,
      popular: false
    },
    {
      icon: Shield,
      title: t("services.securityAudit"),
      description: t("services.securityAudit.desc"),
      features: ["Vulnerability Scanning", "Security Hardening", "SSL Implementation", "Monitoring"],
      priceIdr: 5000000,
      monthly: false,
      discountPercent: 8,
      popular: false
    },
    {
      icon: Headphones,
      title: t("services.maintenanceSupport"),
      description: t("services.maintenanceSupport.desc"),
      features: ["Regular Updates", "Bug Fixes", "Performance Monitoring", "Content Updates"],
      priceIdr: 2000000,
      monthly: true,
      discountPercent: 0,
      popular: false
    }
  ] as const;

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
                Transparent Pricing, Real Impact
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              No hidden fees. Just smart, sleek solutions built for growth.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Core Packages (3-tier grid) */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: 4500000,
                features: [
                  "Landing page",
                  "1–3 halaman",
                  "SEO dasar",
                  "Hosting + domain 1 tahun",
                  "1 revisi"
                ],
                popular: false
              },
              {
                name: "Growth",
                price: 12000000,
                features: [
                  "Website korporat",
                  "CMS",
                  "Desain custom",
                  "SEO lengkap",
                  "3 bulan maintenance"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: 22000000,
                features: [
                  "E-commerce / custom app",
                  "Sistem pembayaran",
                  "Dashboard admin",
                  "6 bulan maintenance"
                ],
                suffix: "+",
                popular: false
              }
            ].map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className={`h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 ${
                  pkg.popular ? 'ring-2 ring-cyan-500/50' : ''
                }`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold px-4 py-1">
                        Paling Populer
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                      <span className="text-black font-bold">{i + 1}</span>
                    </div>
                    <CardTitle className="text-xl text-white">
                      {pkg.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-cyan-400 mb-4">
                      {formatRupiah(pkg.price)}{pkg.suffix ?? ''}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all duration-300">
                      <Link to="/contact">Discuss Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    {/* Promo Banner */}
    <section className="py-4 bg-gradient-to-r from-cyan-900/10 via-cyan-700/10 to-blue-900/10 border-y border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 text-cyan-200 text-sm">
          <span className="inline-flex items-center rounded-full bg-cyan-500/15 text-cyan-300 px-3 py-1 border border-cyan-400/20">Promo</span>
          <span>Diskon hingga 20% untuk proyek baru. Berlaku sampai akhir bulan.</span>
        </div>
      </div>
    </section>

    {/* Add-Ons & Value-Add Services */}
    <section className="py-12 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-white mb-6">Add-Ons & Value-Add</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: 'UI/UX Design', price: 3500000, suffix: '+' },
            { name: 'Digital Branding', price: 3000000, suffix: '+' },
            { name: 'SEO Optimization', price: 2500000, suffix: '/bulan' },
            { name: 'Analytics Integration', price: 1500000, note: 'Included in Growth+' }
          ].map((item, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-white font-semibold mb-2">{item.name}</div>
                <div className="text-cyan-400">
                  {item.note ? (
                    <span>{item.note} / {formatRupiah(item.price)}</span>
                  ) : (
                    <span>{formatRupiah(item.price)}{item.suffix ?? ''}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Services with Discounts */}
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-2">Layanan Unggulan</h2>
          <p className="text-gray-400">Harga transparan dengan promo aktif — lihat hematannya</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const discounted = Math.round(service.priceIdr * (1 - service.discountPercent / 100));
            const saved = service.priceIdr - discounted;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
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
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-4">
                      {service.discountPercent > 0 && (
                        <>
                          <div className="text-sm text-gray-400 line-through">
                            Mulai dari {formatRupiah(service.priceIdr)}{service.monthly ? "/bulan" : ""}
                          </div>
                          <div className="text-xs text-emerald-300">Hemat {formatRupiah(saved)}</div>
                        </>
                      )}
                      <div className="text-lg font-semibold text-cyan-400">
                        Mulai dari {formatRupiah(discounted)}{service.monthly ? "/bulan" : ""}
                      </div>
                    </div>
                    <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all duration-300">
                      <Link to="/contact">{t("services.getStarted")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Recurring Revenue Section */}
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-white mb-2">Keep Your Site Running Smoothly</h2>
          <p className="text-gray-400">Pilih paket maintenance yang sesuai kebutuhan Anda</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Basic', price: 1200000, includes: ['Backup', 'Security updates'] },
            { name: 'Growth', price: 2500000, includes: ['+ SEO', 'Analytics', 'Minor updates'] },
            { name: 'Retainer', price: 4000000, includes: ['5 jam kerja/bulan'] },
          ].map((plan, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-xl text-white mb-2">{plan.name}</div>
                <div className="text-cyan-400 font-semibold mb-4">{formatRupiah(plan.price)}/bulan</div>
                <ul className="space-y-2 mb-6">
                  {plan.includes.map((inc, i2) => (
                    <li key={i2} className="flex items-center text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                      {inc}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-gray-400">Clients on Growth+ plans get 20% off first 6 months</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </section>

      {/* Special Section: For Students */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-2">Mahasiswa? Kita Bantu.</h2>
            <p className="text-gray-400">Konsultasi gratis 30 menit untuk mulai</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Tugas Web', range: [150000, 300000] },
              { name: 'Web Interaktif', range: [350000, 600000] },
              { name: 'Full-Stack Project', range: [800000, 1500000] },
            ].map((s, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-white font-semibold mb-2">{s.name}</div>
                  <div className="text-cyan-400">{formatRupiah(s.range[0])} – {formatRupiah(s.range[1])}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
              <Link to="/contact">Ajukan Konsultasi Gratis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">FAQ</h2>
          <div className="space-y-6">
            {[ 
              { q: 'Apakah harga bisa dinegosiasi?', a: 'Ya, untuk proyek besar atau kerja sama jangka panjang.' },
              { q: 'Apakah termasuk domain & hosting?', a: 'Ya, untuk paket Starter ke atas (1 tahun).' },
              { q: 'Berapa lama pengerjaan?', a: '2–4 minggu (tergantung kompleksitas).' },
              { q: 'Apakah ada maintenance setelah launch?', a: 'Ada opsi bulanan — kami sarankan untuk performa & keamanan.' },
            ].map((item, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-white font-semibold mb-2">{item.q}</div>
                  <div className="text-gray-400">{item.a}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-4">Belum yakin paket mana yang cocok?</h2>
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
              <Link to="/contact">Booking Konsultasi Gratis →</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
