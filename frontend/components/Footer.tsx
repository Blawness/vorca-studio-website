import { Link } from "react-router-dom";
import { Instagram, Linkedin, Github, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#001F3F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#001F3F] font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold">Vorca Studio</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:hello@vorca.studio" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/services" className="hover:text-white transition-colors">{t("services.web.title")}</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">{t("services.uiux.title")}</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">{t("services.branding.title")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:text-white transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">{t("nav.portfolio")}</Link></li>
              <li><Link to="/students" className="hover:text-white transition-colors">{t("nav.students")}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Vorca Studio. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
