"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";

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

      // Reset form
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
    <div className="pt-16 bg-black">
      <PageHero
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    {t("contact.sendMessage")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">{t("contact.name")} *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500"
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
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500"
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
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-gray-300">{t("contact.company")}</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceType" className="text-gray-300">{t("contact.service")} *</Label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {serviceTypes.map((service) => (
                            <SelectItem key={service} value={service} className="text-white hover:bg-gray-700">
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
                        placeholder="Tell us about your project..."
                        required
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all duration-300"
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
                </CardContent>
              </Card>
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
                <h2 className="text-4xl font-bold text-white mb-6">
                  {t("contact.getInTouch")}
                </h2>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  {t("contact.getInTouch.desc")}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                            <info.icon className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{info.title}</h3>
                            <a
                              href={info.link}
                              className="text-gray-400 hover:text-cyan-400 transition-colors"
                            >
                              {info.value}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-white p-8 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">
                  {t("contact.freeConsultation")}
                </h3>
                <p className="text-gray-300 mb-4">
                  {t("contact.freeConsultation.desc")}
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-xl transition-all duration-300"
                  size="lg"
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

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              {t("contact.visitOffice")}
            </h2>
            <p className="text-xl text-gray-400">
              {t("contact.visitOffice.desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 h-96 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          >
            <p className="text-gray-400">{t("contact.mapPlaceholder")}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
