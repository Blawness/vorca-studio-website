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
    "hero.title": "Build Modern Web Apps. End-to-End.",
    "hero.subtitle": "Kami mengembangkan website dan aplikasi berbasis web yang cepat, scalable, dan siap digunakan untuk kebutuhan operasional bisnis Anda.",
    "hero.description": "Dari frontend, backend, hingga database, semuanya ditangani secara menyeluruh dan terstruktur.",
    "hero.cta": "Mulai Proyek",
    "hero.consultation": "Jadwalkan Konsultasi",

    // Value Pillars
    "valuePillars.fullStack.title": "Full-Stack Development",
    "valuePillars.fullStack.desc": "Aplikasi web modern dengan arsitektur jelas, performa stabil, dan struktur kode yang rapi.",
    "valuePillars.scalable.title": "Scalable Infrastructure",
    "valuePillars.scalable.desc": "Fondasi teknis yang mudah dikembangkan saat bisnis atau traffic bertambah.",
    "valuePillars.workflow.title": "Operational Workflow Ready",
    "valuePillars.workflow.desc": "Sistem yang benar-benar dipakai tim internal: CRUD, dashboard, roles, integrasi, dan alur kerja operasional.",

    // Core Services
    "services.title": "Layanan Vorca Studio",
    "services.subtitle": "Fokus pada solusi pengembangan web modern dan aplikasi berbasis web yang scalable.",

    // Core Services Pillar
    "services.core.title": "Layanan Inti (Core Services)",
    "services.core.desc": "Layanan utama yang membentuk fondasi teknologi digital klien.",

    "services.web.title": "Pengembangan Website",
    "services.web.description": "Website modern, responsif, dan dirancang untuk kebutuhan brand maupun operasional bisnis.",
    "services.web.features": "Company profile, Landing page, Microsite campaign",

    "services.apps.title": "Aplikasi Bisnis & Web App",
    "services.apps.description": "Sistem berbasis web untuk kebutuhan internal maupun operasional bisnis.",
    "services.apps.features": "Dashboard, Sistem CRUD, Manajemen data, Autentikasi pengguna, Role-based access, Workflow internal, Integrasi API",

    "services.frontend.title": "Frontend Development",
    "services.frontend.description": "UI/UX modern berbasis Next.js, React, Tailwind CSS, dan komponen custom reusable. Berfokus pada performa UI, aksesibilitas, dan scalability.",

    "services.system.title": "System Architecture & Integrations",
    "services.system.description": "Perancangan struktur aplikasi yang jelas, desain database, dan integrasi sistem supaya aplikasi berjalan stabil dan efisien.",

    // Design Pillar
    "services.design.title": "Layanan Pendukung (Design & Branding)",
    "services.design.desc": "Untuk bisnis yang membutuhkan identitas visual dan antarmuka yang kuat.",

    "services.uiux.title": "UI/UX Design",
    "services.uiux.description": "Desain antarmuka dengan flow intuitif, layout jelas, dan komponen siap implementasi.",

    "services.branding.title": "Digital Branding",
    "services.branding.description": "Elemen visual dasar untuk membangun identitas brand.",
    "services.branding.features": "Warna, Tipografi, Logo ringan, Style direction",

    // Maintenance Pillar
    "services.maintenance.title": "Maintenance & Support",
    "services.maintenance.desc": "Menjaga aplikasi tetap stabil dan optimal setelah deploy.",

    "services.maintenance.web.title": "Website / Web App Maintenance",
    "services.maintenance.web.features": "Update konten, Performance monitoring, Bug fixing, Routine updates",

    "services.maintenance.perf.title": "Performance Optimization",
    "services.maintenance.perf.features": "Optimasi struktur, Perbaikan kecepatan loading, Efisiensi frontend & backend",

    // Addons
    "services.addons.title": "Add-Ons (Opsional)",
    "services.addons.desc": "Tambahan yang melengkapi layanan inti.",
    "services.addons.list": "SEO Basic Setup, Analytics Setup, Deployment VPS/Cloud, Integrasi API tambahan",

    "services.cta.discuss": "Diskusikan Proyek Anda",

    // Tech Stack
    "techStack.title": "Tech Stack Kami",
    "techStack.description": "Teknologi yang kami gunakan berfokus pada performa, maintainability, dan skalabilitas.",

    // System Types
    "systemTypes.title": "Jenis Sistem yang Bisa Kami Bangun",
    "systemTypes.data": "Sistem manajemen data",
    "systemTypes.reservation": "Sistem reservasi",
    "systemTypes.crm": "CRM mini",
    "systemTypes.inventory": "Inventory & product tracking",
    "systemTypes.hris": "HRIS sederhana",
    "systemTypes.kpi": "Dashboard KPI",
    "systemTypes.ticket": "Sistem tiket internal",
    "systemTypes.workflow": "Workflow operasional custom",

    // Why Choose
    "whyChoose.title": "Why Choose Vorca Studio",
    "whyChoose.engineering.title": "Engineering-first Approach",
    "whyChoose.engineering.desc": "Kami memprioritaskan arsitektur, struktur, dan workflow teknis yang scalable.",
    "whyChoose.cleanUi.title": "Clean UI, Solid Backend",
    "whyChoose.cleanUi.desc": "Perpaduan UI modern yang rapi dengan fondasi backend yang kuat.",
    "whyChoose.docs.title": "Dokumentasi & Maintainability",
    "whyChoose.docs.desc": "Setiap proyek dirancang agar mudah dikembangkan dalam jangka panjang.",

    // CTA Footer
    "cta.title": "Siap membangun aplikasi web yang benar-benar dipakai tim Anda?",
    "cta.description": "Ayo diskusi, dan kami bantu merancang arsitektur yang paling efisien untuk kebutuhan bisnis Anda.",
    "cta.button": "Konsultasi Gratis",

    // About
    "about.title": "Tentang Vorca Studio",
    "about.subtitle": "Terinspirasi oleh kekuatan dan kecerdasan Orca",
    "about.mission": "Misi kami adalah membantu bisnis mencapai dominasi digital melalui solusi web yang inovatif dan strategis.",
    "about.whyOrca": "Mengapa Orca?",
    "about.whyOrca.desc1": "Orca, atau Paus Pembunuh, mewakili segala sesuatu yang kami perjuangkan: kecerdasan, kekuatan, dan presisi.",
    "about.whyOrca.desc2": "Sama seperti Orca mendominasi lautan melalui strategi berburu yang canggih, kami membantu bisnis mendominasi lanskap digital.",
    "about.ourValues": "Nilai-Nilai Kami",
    "about.ourValues.desc": "Prinsip-prinsip yang memandu segala yang kami lakukan",
    "about.precision": "Presisi",
    "about.precision.desc": "Solusi yang tepat sasaran.",
    "about.power": "Kekuatan",
    "about.power.desc": "Memanfaatkan teknologi modern untuk dampak maksimal.",
    "about.collaboration": "Kolaborasi",
    "about.collaboration.desc": "Bekerja bersama untuk hasil luar biasa.",
    "about.passion": "Passion",
    "about.passion.desc": "Cinta sejati untuk menciptakan pengalaman digital yang luar biasa.",
    "about.meetOurPod": "Kenali Tim Kami",
    "about.meetOurPod.desc": "Individu-individu berbakat di balik Vorca Studio",

    // Students
    "students.title": "Untuk Mahasiswa",
    "students.subtitle": "Bantuan tugas kuliah dengan harga terjangkau",
    "students.consultation": "Konsultasi Gratis 30 Menit",
    "students.pricing": "Harga Transparan",
    "students.whyChoose": "Mengapa Memilih Vorca?",
    "students.whyChoose.desc": "Solusi yang disesuaikan untuk mahasiswa",
    "students.affordablePricing": "Harga terjangkau",
    "students.quickTurnaround": "Cepat selesai",
    "students.highQuality": "Berkualitas tinggi",
    "students.codeExplanation": "Penjelasan kode",
    "students.revisionSupport": "Dukungan revisi",
    "students.communication": "Komunikasi 24/7",
    "students.servicesAndPricing": "Layanan & Harga",
    "students.servicesAndPricing.desc": "Harga transparan untuk mahasiswa",
    "students.webDevProjects": "Proyek Web",
    "students.webDevProjects.desc": "Pengembangan website lengkap",
    "students.uiuxDesign": "UI/UX Design",
    "students.uiuxDesign.desc": "Desain profesional",
    "students.programmingAssignments": "Tugas Coding",
    "students.programmingAssignments.desc": "Bantuan tugas pemrograman",
    "students.howItWorks": "Cara Kerja",
    "students.howItWorks.desc": "Proses sederhana",
    "students.submitBrief": "Kirim Brief",
    "students.submitBrief.desc": "Ceritakan kebutuhan Anda",
    "students.freeConsultation": "Konsultasi Gratis",
    "students.freeConsultation.desc": "Diskusi 30 menit",
    "students.development": "Pengembangan",
    "students.development.desc": "Kami kerjakan proyek Anda",
    "students.explanation": "Penjelasan",
    "students.explanation.desc": "Kami jelaskan kodenya",
    "students.faq": "FAQ",
    "students.readyToAce": "Siap Mulai?",
    "students.readyToAce.desc": "Hubungi kami sekarang",
    "students.startFreeConsultation": "Mulai Konsultasi",

    // Footer
    "footer.description": "Agency web disruptif yang terinspirasi oleh Orca",
    "footer.services": "Layanan",
    "footer.company": "Perusahaan",
    "footer.contact": "Kontak",
    "footer.rights": "Hak Cipta Dilindungi",

    // Common
    "common.nextGen": "Solusi Digital Generasi Baru",
    "common.lightningFast": "Sangat Cepat",
    "common.lightningFast.desc": "Dioptimalkan untuk performa",
    "common.enterpriseSecurity": "Keamanan Enterprise",
    "common.enterpriseSecurity.desc": "Keamanan tingkat tinggi",
    "common.aiPowered": "Bertenaga AI",
    "common.aiPowered.desc": "Otomasi cerdas",
    "common.viewAllServices": "Lihat Semua Layanan",
    "common.readyToDominate": "Siap Mendominasi?",
    "common.readyToDominate.desc": "Mari ciptakan sesuatu yang kuat.",
    "common.viewOurWork": "Lihat Karya Kami",
    "common.happyClients": "Klien Puas",
    "common.projectsCompleted": "Proyek Selesai",
    "common.clientSatisfaction": "Kepuasan Klien",
    "common.yearsExperience": "Tahun Pengalaman",

    // Contact
    "contact.title": "Hubungi Kami",
    "contact.subtitle": "Mari diskusikan proyek Anda",
    "contact.sendMessage": "Kirim pesan",
    "contact.getInTouch": "Hubungi Kami",
    "contact.getInTouch.desc": "Siap memulai? Kami ingin mendengar dari Anda.",
    "contact.email": "Email",
    "contact.phone": "Telepon",
    "contact.location": "Lokasi",
    "contact.freeConsultation": "Konsultasi Gratis",
    "contact.freeConsultation.desc": "Pesan konsultasi gratis 30 menit.",
    "contact.scheduleCall": "Jadwalkan Panggilan",
    "contact.visitOffice": "Kunjungi Kantor",
    "contact.visitOffice.desc": "Jakarta Selatan",
    "contact.mapPlaceholder": "Peta",
    "contact.name": "Nama",
    "contact.company": "Perusahaan",
    "contact.message": "Pesan",
    "contact.submit": "Kirim Pesan",

    // Portfolio
    "portfolio.title": "Portfolio Kami",
    "portfolio.subtitle": "Karya terbaik kami",
    "portfolio.all": "Semua",
    "portfolio.webDevelopment": "Web Dev",
    "portfolio.uiuxDesign": "UI/UX",
    "portfolio.mobileDevelopment": "Mobile",
    "portfolio.branding": "Branding",
    "portfolio.view": "Lihat",
    "portfolio.code": "Kode",
    "portfolio.results": "Hasil",
    "portfolio.readyToCreate": "Siap Berkarya?",
    "portfolio.readyToCreate.desc": "Wujudkan visi Anda.",
    "portfolio.startYourProject": "Mulai Proyek",
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
    "hero.title": "Build Modern Web Apps. End-to-End.",
    "hero.subtitle": "We develop fast, scalable web applications and websites ready for your business operational needs.",
    "hero.description": "From frontend, backend, to database, everything is handled thoroughly and structured.",
    "hero.cta": "Start Project",
    "hero.consultation": "Schedule Consultation",

    // Value Pillars
    "valuePillars.fullStack.title": "Full-Stack Development",
    "valuePillars.fullStack.desc": "Modern web apps with clear architecture, stable performance, and clean code structure.",
    "valuePillars.scalable.title": "Scalable Infrastructure",
    "valuePillars.scalable.desc": "Technical foundation that is easy to scale as business or traffic grows.",
    "valuePillars.workflow.title": "Operational Workflow Ready",
    "valuePillars.workflow.desc": "Systems truly used by internal teams: CRUD, dashboard, roles, integrations, and operational workflows.",

    // Core Services
    "services.title": "Vorca Studio Services",
    "services.subtitle": "Focus on modern web development solutions and scalable web-based applications.",

    // Core Services Pillar
    "services.core.title": "Core Services",
    "services.core.desc": "Main services that form the digital technology foundation for clients.",

    "services.web.title": "Web Development",
    "services.web.description": "Modern, responsive websites designed for brand and business operational needs.",
    "services.web.features": "Company profile, Landing page, Microsite campaign",

    "services.apps.title": "Business Apps & Web App",
    "services.apps.description": "Web-based systems for internal and business operational needs.",
    "services.apps.features": "Dashboard, CRUD Systems, Data Management, User Authentication, Role-based access, Internal Workflow, API Integration",

    "services.frontend.title": "Frontend Development",
    "services.frontend.description": "Modern UI/UX based on Next.js, React, Tailwind CSS, and reusable custom components. Focused on UI performance, accessibility, and scalability.",

    "services.system.title": "System Architecture & Integrations",
    "services.system.description": "Clear application structure design, database design, and system integration for stable and efficient applications.",

    // Design Pillar
    "services.design.title": "Supporting Services (Design & Branding)",
    "services.design.desc": "For businesses needing strong visual identity and interface.",

    "services.uiux.title": "UI/UX Design",
    "services.uiux.description": "Interface design with intuitive flow, clear layout, and implementation-ready components.",

    "services.branding.title": "Digital Branding",
    "services.branding.description": "Basic visual elements to build brand identity.",
    "services.branding.features": "Colors, Typography, Light Logo, Style direction",

    // Maintenance Pillar
    "services.maintenance.title": "Maintenance & Support",
    "services.maintenance.desc": "Keeping applications stable and optimal after deployment.",

    "services.maintenance.web.title": "Website / Web App Maintenance",
    "services.maintenance.web.features": "Content updates, Performance monitoring, Bug fixing, Routine updates",

    "services.maintenance.perf.title": "Performance Optimization",
    "services.maintenance.perf.features": "Structure optimization, Loading speed improvement, Frontend & backend efficiency",

    // Addons
    "services.addons.title": "Add-Ons (Optional)",
    "services.addons.desc": "Additions that complement core services.",
    "services.addons.list": "SEO Basic Setup, Analytics Setup, VPS/Cloud Deployment, Additional API Integration",

    "services.cta.discuss": "Discuss Your Project",

    // Tech Stack
    "techStack.title": "Our Tech Stack",
    "techStack.description": "Technologies we use focus on performance, maintainability, and scalability.",

    // System Types
    "systemTypes.title": "Types of Systems We Build",
    "systemTypes.data": "Data management systems",
    "systemTypes.reservation": "Reservation systems",
    "systemTypes.crm": "Mini CRM",
    "systemTypes.inventory": "Inventory & product tracking",
    "systemTypes.hris": "Simple HRIS",
    "systemTypes.kpi": "KPI Dashboard",
    "systemTypes.ticket": "Internal ticket system",
    "systemTypes.workflow": "Custom operational workflow",

    // Why Choose
    "whyChoose.title": "Why Choose Vorca Studio",
    "whyChoose.engineering.title": "Engineering-first Approach",
    "whyChoose.engineering.desc": "We prioritize architecture, structure, and scalable technical workflows.",
    "whyChoose.cleanUi.title": "Clean UI, Solid Backend",
    "whyChoose.cleanUi.desc": "Combination of clean modern UI with a strong backend foundation.",
    "whyChoose.docs.title": "Documentation & Maintainability",
    "whyChoose.docs.desc": "Every project is designed to be easily developed in the long term.",

    // CTA Footer
    "cta.title": "Ready to build web apps your team actually uses?",
    "cta.description": "Let's discuss, and we'll help design the most efficient architecture for your business needs.",
    "cta.button": "Free Consultation",

    // About
    "about.title": "About Vorca Studio",
    "about.subtitle": "Inspired by the power and intelligence of the Orca",
    "about.mission": "Our mission is to help businesses achieve digital dominance through innovative and strategic web solutions.",
    "about.whyOrca": "Why the Orca?",
    "about.whyOrca.desc1": "The Orca represents intelligence, power, and precision.",
    "about.whyOrca.desc2": "Just as Orcas dominate the ocean, we help businesses dominate the digital landscape.",
    "about.ourValues": "Our Values",
    "about.ourValues.desc": "Principles guiding us",
    "about.precision": "Precision",
    "about.precision.desc": "Exact solutions.",
    "about.power": "Power",
    "about.power.desc": "Maximum impact.",
    "about.collaboration": "Collaboration",
    "about.collaboration.desc": "Working together.",
    "about.passion": "Passion",
    "about.passion.desc": "Love for digital experiences.",
    "about.meetOurPod": "Meet Our Pod",
    "about.meetOurPod.desc": "The team behind Vorca Studio",

    // Students
    "students.title": "For Students",
    "students.subtitle": "Affordable assignment help",
    "students.consultation": "Free 30-Min Consultation",
    "students.pricing": "Transparent Pricing",
    "students.whyChoose": "Why Choose Vorca?",
    "students.whyChoose.desc": "Tailored for students",
    "students.affordablePricing": "Affordable pricing",
    "students.quickTurnaround": "Quick turnaround",
    "students.highQuality": "High quality",
    "students.codeExplanation": "Code explanation",
    "students.revisionSupport": "Revision support",
    "students.communication": "24/7 communication",
    "students.servicesAndPricing": "Services & Pricing",
    "students.servicesAndPricing.desc": "Student budget friendly",
    "students.webDevProjects": "Web Projects",
    "students.webDevProjects.desc": "Complete web dev",
    "students.uiuxDesign": "UI/UX Design",
    "students.uiuxDesign.desc": "Professional design",
    "students.programmingAssignments": "Coding Assignments",
    "students.programmingAssignments.desc": "Help with coding",
    "students.howItWorks": "How It Works",
    "students.howItWorks.desc": "Simple process",
    "students.submitBrief": "Submit Brief",
    "students.submitBrief.desc": "Tell us your needs",
    "students.freeConsultation": "Free Consultation",
    "students.freeConsultation.desc": "30-min discussion",
    "students.development": "Development",
    "students.development.desc": "We build it",
    "students.explanation": "Explanation",
    "students.explanation.desc": "We explain it",
    "students.faq": "FAQ",
    "students.readyToAce": "Ready to Ace?",
    "students.readyToAce.desc": "Contact us now",
    "students.startFreeConsultation": "Start Consultation",

    // Footer
    "footer.description": "Disruptive web agency inspired by the Orca",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.rights": "All Rights Reserved",

    // Common
    "common.nextGen": "Next-Gen Digital Solutions",
    "common.lightningFast": "Lightning Fast",
    "common.lightningFast.desc": "Optimized for performance",
    "common.enterpriseSecurity": "Enterprise Security",
    "common.enterpriseSecurity.desc": "Bank-level security",
    "common.aiPowered": "AI-Powered",
    "common.aiPowered.desc": "Smart automation",
    "common.viewAllServices": "View All Services",
    "common.readyToDominate": "Ready to Dominate?",
    "common.readyToDominate.desc": "Let's create something powerful.",
    "common.viewOurWork": "View Our Work",
    "common.happyClients": "Happy Clients",
    "common.projectsCompleted": "Projects Completed",
    "common.clientSatisfaction": "Client Satisfaction",
    "common.yearsExperience": "Years Experience",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Let's discuss",
    "contact.sendMessage": "Send message",
    "contact.getInTouch": "Get in Touch",
    "contact.getInTouch.desc": "We'd love to hear from you.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.freeConsultation": "Free Consultation",
    "contact.freeConsultation.desc": "Book a free 30-min consultation.",
    "contact.scheduleCall": "Schedule Call",
    "contact.visitOffice": "Visit Office",
    "contact.visitOffice.desc": "South Jakarta",
    "contact.mapPlaceholder": "Map",
    "contact.name": "Name",
    "contact.company": "Company",
    "contact.message": "Message",
    "contact.submit": "Send Message",

    // Portfolio
    "portfolio.title": "Our Portfolio",
    "portfolio.subtitle": "Our best work",
    "portfolio.all": "All",
    "portfolio.webDevelopment": "Web Dev",
    "portfolio.uiuxDesign": "UI/UX",
    "portfolio.mobileDevelopment": "Mobile",
    "portfolio.branding": "Branding",
    "portfolio.view": "View",
    "portfolio.code": "Code",
    "portfolio.results": "Results",
    "portfolio.readyToCreate": "Ready to Create?",
    "portfolio.readyToCreate.desc": "Bring your vision to life.",
    "portfolio.startYourProject": "Start Project",
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
