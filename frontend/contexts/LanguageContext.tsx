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

    // Common
    "common.nextGen": "Solusi Digital Generasi Baru",
    "common.lightningFast": "Sangat Cepat",
    "common.lightningFast.desc": "Dioptimalkan untuk performa dan kecepatan",
    "common.enterpriseSecurity": "Keamanan Enterprise",
    "common.enterpriseSecurity.desc": "Keamanan tingkat bank untuk data Anda",
    "common.aiPowered": "Bertenaga AI",
    "common.aiPowered.desc": "Otomasi cerdas dan wawasan mendalam",
    "common.viewAllServices": "Lihat Semua Layanan",
    "common.readyToDominate": "Siap Mendominasi Samudra Digital?",
    "common.readyToDominate.desc": "Mari ciptakan sesuatu yang kuat bersama-sama. Mulai proyek Anda hari ini.",
    "common.viewOurWork": "Lihat Karya Kami",
    "common.happyClients": "Klien Puas",
    "common.projectsCompleted": "Proyek Selesai",
    "common.clientSatisfaction": "Kepuasan Klien",
    "common.yearsExperience": "Tahun Pengalaman",

    // Services Page
    "services.webHosting": "Web Hosting",
    "services.webHosting.desc": "Solusi hosting yang andal dan aman",
    "services.mobileApps": "Aplikasi Mobile",
    "services.mobileApps.desc": "Aplikasi mobile native dan cross-platform",
    "services.seoOptimization": "Optimasi SEO",
    "services.seoOptimization.desc": "Tingkatkan peringkat mesin pencari Anda",
    "services.securityAudit": "Audit Keamanan",
    "services.securityAudit.desc": "Penilaian dan perlindungan keamanan komprehensif",
    "services.maintenanceSupport": "Pemeliharaan & Dukungan",
    "services.maintenanceSupport.desc": "Pemeliharaan website berkelanjutan dan dukungan teknis",
    "services.mostPopular": "Paling Populer",
    "services.getStarted": "Mulai",
    "services.ourProcess": "Proses Kami",
    "services.ourProcess.desc": "Pendekatan yang efisien untuk memberikan hasil luar biasa",
    "services.discovery": "Penemuan",
    "services.discovery.desc": "Memahami kebutuhan dan tujuan Anda",
    "services.strategy": "Strategi",
    "services.strategy.desc": "Merencanakan solusi yang sempurna",
    "services.development": "Pengembangan",
    "services.development.desc": "Membangun dengan presisi dan perhatian",
    "services.launch": "Peluncuran",
    "services.launch.desc": "Menerapkan dan mengoptimalkan untuk kesuksesan",
    "services.readyToStart": "Siap Memulai Proyek Anda?",
    "services.readyToStart.desc": "Mari diskusikan bagaimana kami dapat membantu Anda mencapai tujuan digital.",
    "services.getFreeConsultation": "Dapatkan Konsultasi Gratis",

    // Portfolio Page
    "portfolio.title": "Portfolio Kami",
    "portfolio.subtitle": "Menampilkan karya terbaik kami dan dampak yang telah kami ciptakan untuk klien",
    "portfolio.all": "Semua",
    "portfolio.webDevelopment": "Pengembangan Web",
    "portfolio.uiuxDesign": "UI/UX Design",
    "portfolio.mobileDevelopment": "Pengembangan Mobile",
    "portfolio.branding": "Branding",
    "portfolio.view": "Lihat",
    "portfolio.code": "Kode",
    "portfolio.results": "Hasil:",
    "portfolio.readyToCreate": "Siap Menciptakan Sesuatu yang Menakjubkan?",
    "portfolio.readyToCreate.desc": "Mari diskusikan proyek Anda dan wujudkan visi Anda.",
    "portfolio.startYourProject": "Mulai Proyek Anda",

    // About Page
    "about.whyOrca": "Mengapa Orca?",
    "about.whyOrca.desc1": "Orca, atau Paus Pembunuh, mewakili segala sesuatu yang kami perjuangkan: kecerdasan, kekuatan, dan presisi. Makhluk megah ini adalah predator puncak bukan hanya melalui kekuatan kasar, tetapi melalui pemikiran strategis, kerja tim, dan kemampuan beradaptasi.",
    "about.whyOrca.desc2": "Sama seperti Orca mendominasi lautan melalui strategi berburu yang canggih dan ikatan keluarga yang kuat, kami membantu bisnis mendominasi lanskap digital melalui solusi cerdas dan kemitraan kolaboratif.",
    "about.ourValues": "Nilai-Nilai Kami",
    "about.ourValues.desc": "Prinsip-prinsip yang memandu segala yang kami lakukan",
    "about.precision": "Presisi",
    "about.precision.desc": "Seperti teknik berburu Orca yang presisi, kami memberikan solusi yang tepat.",
    "about.power": "Kekuatan",
    "about.power.desc": "Memanfaatkan kekuatan teknologi modern untuk dampak maksimal.",
    "about.collaboration": "Kolaborasi",
    "about.collaboration.desc": "Bekerja bersama sebagai kelompok untuk mencapai hasil luar biasa.",
    "about.passion": "Passion",
    "about.passion.desc": "Didorong oleh cinta sejati untuk menciptakan pengalaman digital yang luar biasa.",
    "about.meetOurPod": "Kenali Tim Kami",
    "about.meetOurPod.desc": "Individu-individu berbakat di balik Vorca Studio",

    // Students Page
    "students.whyChoose": "Mengapa Memilih Vorca untuk Tugas Anda?",
    "students.whyChoose.desc": "Kami memahami tantangan yang dihadapi mahasiswa dan menyediakan solusi yang disesuaikan",
    "students.affordablePricing": "Harga terjangkau untuk mahasiswa",
    "students.quickTurnaround": "Waktu penyelesaian cepat",
    "students.highQuality": "Pekerjaan berkualitas tinggi",
    "students.codeExplanation": "Penjelasan kode disertakan",
    "students.revisionSupport": "Dukungan revisi",
    "students.communication": "Komunikasi 24/7",
    "students.servicesAndPricing": "Layanan & Harga Mahasiswa",
    "students.servicesAndPricing.desc": "Harga transparan yang dirancang untuk anggaran mahasiswa",
    "students.webDevProjects": "Proyek Pengembangan Web",
    "students.webDevProjects.desc": "Pengembangan website lengkap untuk tugas Anda",
    "students.uiuxDesign": "UI/UX Design",
    "students.uiuxDesign.desc": "Desain profesional untuk proyek Anda",
    "students.programmingAssignments": "Tugas Pemrograman",
    "students.programmingAssignments.desc": "Bantuan dengan tugas coding dan proyek",
    "students.howItWorks": "Cara Kerjanya",
    "students.howItWorks.desc": "Proses sederhana dari brief hingga penyelesaian",
    "students.submitBrief": "Kirim Brief",
    "students.submitBrief.desc": "Ceritakan tentang persyaratan tugas dan deadline Anda",
    "students.freeConsultation": "Konsultasi Gratis",
    "students.freeConsultation.desc": "Diskusi 30 menit untuk memahami kebutuhan Anda lebih baik",
    "students.development": "Pengembangan",
    "students.development.desc": "Kami membangun proyek Anda dengan update berkala",
    "students.explanation": "Penjelasan",
    "students.explanation.desc": "Kami menjelaskan kode/desain agar Anda memahaminya sepenuhnya",
    "students.faq": "Pertanyaan yang Sering Diajukan",
    "students.readyToAce": "Siap Menguasai Tugas Anda?",
    "students.readyToAce.desc": "Dapatkan konsultasi gratis dan mari diskusikan persyaratan proyek Anda.",
    "students.startFreeConsultation": "Mulai Konsultasi Gratis",

    // Contact Page
    "contact.sendMessage": "Kirim pesan kepada kami",
    "contact.getInTouch": "Hubungi Kami",
    "contact.getInTouch.desc": "Siap memulai proyek Anda? Kami ingin mendengar dari Anda. Kirim pesan dan kami akan merespons secepat mungkin.",
    "contact.email": "Email",
    "contact.phone": "Telepon",
    "contact.location": "Lokasi",
    "contact.freeConsultation": "Konsultasi Gratis",
    "contact.freeConsultation.desc": "Tidak yakin harus mulai dari mana? Pesan konsultasi gratis 30 menit untuk mendiskusikan proyek Anda dan mendapatkan saran ahli.",
    "contact.scheduleCall": "Jadwalkan Panggilan",
    "contact.visitOffice": "Kunjungi Kantor Kami",
    "contact.visitOffice.desc": "Berlokasi di jantung San Francisco",
    "contact.mapPlaceholder": "Peta interaktif akan ditampilkan di sini",
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

    // Common
    "common.nextGen": "Next-Gen Digital Solutions",
    "common.lightningFast": "Lightning Fast",
    "common.lightningFast.desc": "Optimized for performance and speed",
    "common.enterpriseSecurity": "Enterprise Security",
    "common.enterpriseSecurity.desc": "Bank-level security for your data",
    "common.aiPowered": "AI-Powered",
    "common.aiPowered.desc": "Smart automation and insights",
    "common.viewAllServices": "View All Services",
    "common.readyToDominate": "Ready to Dominate the Digital Ocean?",
    "common.readyToDominate.desc": "Let's create something powerful together. Start your project today.",
    "common.viewOurWork": "View Our Work",
    "common.happyClients": "Happy Clients",
    "common.projectsCompleted": "Projects Completed",
    "common.clientSatisfaction": "Client Satisfaction",
    "common.yearsExperience": "Years Experience",

    // Services Page
    "services.webHosting": "Web Hosting",
    "services.webHosting.desc": "Reliable and secure hosting solutions",
    "services.mobileApps": "Mobile Apps",
    "services.mobileApps.desc": "Native and cross-platform mobile applications",
    "services.seoOptimization": "SEO Optimization",
    "services.seoOptimization.desc": "Improve your search engine rankings",
    "services.securityAudit": "Security Audit",
    "services.securityAudit.desc": "Comprehensive security assessment and protection",
    "services.maintenanceSupport": "Maintenance & Support",
    "services.maintenanceSupport.desc": "Ongoing website maintenance and technical support",
    "services.mostPopular": "Most Popular",
    "services.getStarted": "Get Started",
    "services.ourProcess": "Our Process",
    "services.ourProcess.desc": "A streamlined approach to deliver exceptional results",
    "services.discovery": "Discovery",
    "services.discovery.desc": "Understanding your needs and goals",
    "services.strategy": "Strategy",
    "services.strategy.desc": "Planning the perfect solution",
    "services.development": "Development",
    "services.development.desc": "Building with precision and care",
    "services.launch": "Launch",
    "services.launch.desc": "Deploying and optimizing for success",
    "services.readyToStart": "Ready to Start Your Project?",
    "services.readyToStart.desc": "Let's discuss how we can help you achieve your digital goals.",
    "services.getFreeConsultation": "Get Free Consultation",

    // Portfolio Page
    "portfolio.title": "Our Portfolio",
    "portfolio.subtitle": "Showcasing our best work and the impact we've created for our clients",
    "portfolio.all": "All",
    "portfolio.webDevelopment": "Web Development",
    "portfolio.uiuxDesign": "UI/UX Design",
    "portfolio.mobileDevelopment": "Mobile Development",
    "portfolio.branding": "Branding",
    "portfolio.view": "View",
    "portfolio.code": "Code",
    "portfolio.results": "Results:",
    "portfolio.readyToCreate": "Ready to Create Something Amazing?",
    "portfolio.readyToCreate.desc": "Let's discuss your project and bring your vision to life.",
    "portfolio.startYourProject": "Start Your Project",

    // About Page
    "about.whyOrca": "Why the Orca?",
    "about.whyOrca.desc1": "The Orca, or Killer Whale, represents everything we stand for: intelligence, power, and precision. These magnificent creatures are apex predators not through brute force alone, but through strategic thinking, teamwork, and adaptability.",
    "about.whyOrca.desc2": "Just as Orcas dominate the ocean through their sophisticated hunting strategies and strong family bonds, we help businesses dominate the digital landscape through intelligent solutions and collaborative partnerships.",
    "about.ourValues": "Our Values",
    "about.ourValues.desc": "The principles that guide everything we do",
    "about.precision": "Precision",
    "about.precision.desc": "Like the Orca's precise hunting techniques, we deliver exact solutions.",
    "about.power": "Power",
    "about.power.desc": "Harnessing the strength of modern technology for maximum impact.",
    "about.collaboration": "Collaboration",
    "about.collaboration.desc": "Working together as a pod to achieve extraordinary results.",
    "about.passion": "Passion",
    "about.passion.desc": "Driven by genuine love for creating exceptional digital experiences.",
    "about.meetOurPod": "Meet Our Pod",
    "about.meetOurPod.desc": "The talented individuals behind Vorca Studio",

    // Students Page
    "students.whyChoose": "Why Choose Vorca for Your Assignments?",
    "students.whyChoose.desc": "We understand the challenges students face and provide tailored solutions",
    "students.affordablePricing": "Affordable student pricing",
    "students.quickTurnaround": "Quick turnaround times",
    "students.highQuality": "High-quality work",
    "students.codeExplanation": "Code explanation included",
    "students.revisionSupport": "Revision support",
    "students.communication": "24/7 communication",
    "students.servicesAndPricing": "Student Services & Pricing",
    "students.servicesAndPricing.desc": "Transparent pricing designed for student budgets",
    "students.webDevProjects": "Web Development Projects",
    "students.webDevProjects.desc": "Complete website development for your assignments",
    "students.uiuxDesign": "UI/UX Design",
    "students.uiuxDesign.desc": "Professional design for your projects",
    "students.programmingAssignments": "Programming Assignments",
    "students.programmingAssignments.desc": "Help with coding assignments and projects",
    "students.howItWorks": "How It Works",
    "students.howItWorks.desc": "Simple process from brief to completion",
    "students.submitBrief": "Submit Brief",
    "students.submitBrief.desc": "Tell us about your assignment requirements and deadline",
    "students.freeConsultation": "Free Consultation",
    "students.freeConsultation.desc": "30-minute discussion to understand your needs better",
    "students.development": "Development",
    "students.development.desc": "We build your project with regular updates",
    "students.explanation": "Explanation",
    "students.explanation.desc": "We explain the code/design so you understand it completely",
    "students.faq": "Frequently Asked Questions",
    "students.readyToAce": "Ready to Ace Your Assignment?",
    "students.readyToAce.desc": "Get your free consultation and let's discuss your project requirements.",
    "students.startFreeConsultation": "Start Free Consultation",

    // Contact Page
    "contact.sendMessage": "Send us a message",
    "contact.getInTouch": "Get in Touch",
    "contact.getInTouch.desc": "Ready to start your project? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.freeConsultation": "Free Consultation",
    "contact.freeConsultation.desc": "Not sure where to start? Book a free 30-minute consultation to discuss your project and get expert advice.",
    "contact.scheduleCall": "Schedule Call",
    "contact.visitOffice": "Visit Our Office",
    "contact.visitOffice.desc": "Located in the heart of San Francisco",
    "contact.mapPlaceholder": "Interactive map would be embedded here",
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
