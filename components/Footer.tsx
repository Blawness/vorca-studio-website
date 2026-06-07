"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/[0.06]">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/favicon.svg"
                alt="Vorca Studio Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Vorca Studio
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/vorcastudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Vorca Studio"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a
                href="https://wa.me/6285167002152"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Vorca Studio"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300"
              >
                <MessageCircle className="w-[18px] h-[18px]" />
              </a>
              <a
                href="mailto:marketing@vorcastudio.com"
                aria-label="Email Vorca Studio"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Mail className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.services")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors duration-300">{t("services.web.title")}</Link></li>
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors duration-300">{t("services.apps.title")}</Link></li>
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors duration-300">{t("services.frontend.title")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.company")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.about")}</Link></li>
              <li><Link href="/portfolio" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.portfolio")}</Link></li>
              <li><Link href="/students" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.students")}</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {year} Vorca Studio. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
