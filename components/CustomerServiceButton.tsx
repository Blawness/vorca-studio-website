"use client";

import { MessageCircle } from "lucide-react";

export default function CustomerServiceButton() {
    return (
        <a
            href="https://wa.me/6285167002152?text=Halo%20Vorca%20Studio%2C%20saya%20mau%20konsultasi%20untuk%20jasa%20pembuatan%20website."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Konsultasi via WhatsApp"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition-all duration-300 p-2 sm:pr-5 animate-bounceIn"
        >
            <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle size={24} />
            </div>
            <span className="hidden sm:inline font-medium text-sm">
                Konsultasi Sekarang!
            </span>
        </a>
    );
}
