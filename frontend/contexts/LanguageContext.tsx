import { createContext, useContext, useState, ReactNode } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  id: {
    // Navigation
    "nav.home": "Beranda",
    "nav.services": "Layanan",
    "nav.portfolio": "Portfolio",
    "nav.about": "Tentang",
    "nav.students": "Untuk Mahasiswa",
    "nav.contact": "Kontak",
    
    // Hero
    "hero.title": "Smart. Sleek. Deep Impact.",
    "hero.subtitle": "Agency web disruptif yang terinspirasi oleh Orca",
    "hero.description": "Kami menciptakan solusi digital yang kuat dan cerdas untuk bisnis Anda. Seperti Orca yang mendominasi lautan, kami membantu brand Anda menguasai dunia digital.",
    "hero.cta": "Mulai Proyek Anda",
    "hero.consultation": "Konsultasi Gratis",
    
    // Services
    "services.title": "Layanan Kami",
    "services.subtitle": "Solusi digital komprehensif untuk setiap kebutuhan bisnis",
    "services.web.title": "Pengembangan Web",
    "services.web.description": "Website modern, responsif, dan performa tinggi",
    "services.uiux.title": "UI/UX Design",
    "services.uiux.description": "Desain antarmuka yang intuitif dan menarik",
    "services.branding.title": "Branding",
    "services.branding.description": "Identitas brand yang kuat dan berkesan",
    
    // About
    "about.title": "Tentang Vorca Studio",
    "about.subtitle": "Terinspirasi oleh kekuatan dan kecerdasan Orca",
    "about.mission": "Misi kami adalah membantu bisnis mencapai dominasi digital melalui solusi web yang inovatif dan strategis.",
    
    // Students
    "students.title": "Untuk Mahasiswa",
    "students.subtitle": "Bantuan tugas kuliah dengan harga terjangkau",
    "students.consultation": "Konsultasi Gratis 30 Menit",
    "students.pricing": "Harga Transparan",
    
    // Contact
    "contact.title": "Hubungi Kami",
    "contact.subtitle": "Mari diskusikan proyek Anda",
    "contact.name": "Nama",
    "contact.email": "Email",
    "contact.phone": "Telepon",
    "contact.company": "Perusahaan",
    "contact.service": "Jenis Layanan",
    "contact.message": "Pesan",
    "contact.submit": "Kirim Pesan",
    
    // Footer
    "footer.description": "Agency web disruptif yang terinspirasi oleh Orca",
    "footer.services": "Layanan",
    "footer.company": "Perusahaan",
    "footer.contact": "Kontak",
    "footer.rights": "Hak Cipta Dilindungi",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.students": "For Students",
    "nav.contact": "Contact",
    
    // Hero
    "hero.title": "Smart. Sleek. Deep Impact.",
    "hero.subtitle": "Disruptive web agency inspired by the Orca",
    "hero.description": "We create powerful and intelligent digital solutions for your business. Like the Orca that dominates the ocean, we help your brand master the digital world.",
    "hero.cta": "Start Your Project",
    "hero.consultation": "Free Consultation",
    
    // Services
    "services.title": "Our Services",
    "services.subtitle": "Comprehensive digital solutions for every business need",
    "services.web.title": "Web Development",
    "services.web.description": "Modern, responsive, and high-performance websites",
    "services.uiux.title": "UI/UX Design",
    "services.uiux.description": "Intuitive and engaging interface design",
    "services.branding.title": "Branding",
    "services.branding.description": "Strong and memorable brand identity",
    
    // About
    "about.title": "About Vorca Studio",
    "about.subtitle": "Inspired by the power and intelligence of the Orca",
    "about.mission": "Our mission is to help businesses achieve digital dominance through innovative and strategic web solutions.",
    
    // Students
    "students.title": "For Students",
    "students.subtitle": "College assignment help at affordable prices",
    "students.consultation": "Free 30-Minute Consultation",
    "students.pricing": "Transparent Pricing",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Let's discuss your project",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.company": "Company",
    "contact.service": "Service Type",
    "contact.message": "Message",
    "contact.submit": "Send Message",
    
    // Footer
    "footer.description": "Disruptive web agency inspired by the Orca",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.rights": "All Rights Reserved",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("id");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
