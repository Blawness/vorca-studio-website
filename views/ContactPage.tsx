"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
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

export default function ContactPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: ""
  });

  const serviceTypes = [
    t("services.web.title"),
    t("services.apps.title"),
    t("services.frontend.title"),
    t("services.system.title"),
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.serviceType || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      toast({
        title: "Success!",
        description: data.message,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        serviceType: "",
        message: ""
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.email"),
      value: "marketing@vorcastudio.com",
      link: "mailto:marketing@vorcastudio.com"
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      value: "+62 851-6700-2152 (WA)",
      link: "https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website."
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      value: "Jakarta Selatan, Indonesia",
      link: "#"
    }
  ];

  return (
    <div className="pt-16 bg-[#050b16]">
      <PageHero
        eyebrow={t("contact.label")}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Contact Section */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className={container}>
          <div className="flex items-start mb-4">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
              <SectionLabel>{t("contact.label") || "HUBUNGI KAMI"}</SectionLabel>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:border-blue-500/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {t("contact.sendMessage")}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">{t("contact.name")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="bg-white/[0.03] border-white/[0.08] text-white focus:border-blue-500/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">{t("contact.email")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="bg-white/[0.03] border-white/[0.08] text-white focus:border-blue-500/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">{t("contact.phone")}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/[0.03] border-white/[0.08] text-white focus:border-blue-500/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-gray-300">{t("contact.company")}</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-white/[0.03] border-white/[0.08] text-white focus:border-blue-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serviceType" className="text-gray-300">{t("contact.service")} *</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                      <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white focus:border-blue-500/30">
                        <SelectValue placeholder={t("contact.servicePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a1628] border-white/[0.08]">
                        {serviceTypes.map((service) => (
                          <SelectItem key={service} value={service} className="text-white hover:bg-white/[0.05]">
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-300">{t("contact.message")} *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder={t("contact.messagePlaceholder")}
                      required
                      className="bg-white/[0.03] border-white/[0.08] text-white focus:border-blue-500/30"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-auto rounded-xl px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 border-0 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("contact.submit")}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {t("contact.getInTouch")}
                </h2>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  {t("contact.getInTouch.desc")}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="group bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:border-blue-500/20 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                          <info.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{info.title}</h3>
                          <a
                            href={info.link}
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-8 hover:border-blue-500/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {t("contact.freeConsultation")}
                </h3>
                <p className="text-gray-400 mb-6">
                  {t("contact.freeConsultation.desc")}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="h-auto rounded-xl px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 border-0 gap-2"
                >
                  <a href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website." target="_blank" rel="noopener noreferrer">
                    {t("contact.scheduleCall")}
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Map Section */}
      <section className="py-24 bg-[#050b16] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className={container}>
          <div className="flex items-start mb-4">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
              <SectionLabel>{t("contact.locationLabel") || "LOKASI"}</SectionLabel>
            </motion.div>
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("contact.visitOffice")}
            </h2>
            <p className="text-lg text-gray-400">
              {t("contact.visitOffice.desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/[0.06] h-96 rounded-xl flex items-center justify-center hover:border-blue-500/20 transition-all duration-300"
          >
            <p className="text-gray-400">{t("contact.mapPlaceholder")}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
