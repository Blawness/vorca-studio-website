import { Link } from "react-router-dom";
import { Instagram, Linkedin, Github, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <span className="text-black font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Vorca Studio
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:marketing@vorcastudio.com" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.services")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors duration-300">{t("services.web.title")}</Link></li>
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors duration-300">{t("services.apps.title")}</Link></li>
              <li><Link to="/services" className="hover:text-cyan-400 transition-colors duration-300">{t("services.frontend.title")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t("footer.company")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.about")}</Link></li>
              <li><Link to="/portfolio" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.portfolio")}</Link></li>
              <li><Link to="/students" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.students")}</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition-colors duration-300">{t("nav.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Vorca Studio. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
