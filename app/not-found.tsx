"use client";

import Link from "next/link";
import { Home, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
    const { language } = useLanguage();
    const id = language === "id";

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#050b16] px-4">
            {/* Background: glow + faded grid (matches PageHero) */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.16)_0%,rgba(6,182,212,0.05)_40%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
            </div>

            <div className="relative z-10 text-center animate-fadeInUp">
                <p className="text-[7rem] sm:text-[10rem] leading-none font-bold bg-gradient-to-br from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                    404
                </p>

                <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">
                    {id ? "Halaman ini berenang terlalu jauh" : "This page swam too far out"}
                </h1>
                <p className="mt-3 text-gray-400 max-w-md mx-auto leading-relaxed">
                    {id
                        ? "Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan. Mari kembali ke perairan yang lebih tenang."
                        : "The page you're looking for doesn't exist or has been moved. Let's get you back to calmer waters."}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all duration-300"
                    >
                        <Home className="w-4 h-4" />
                        {id ? "Kembali ke Beranda" : "Back to Home"}
                    </Link>
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-medium text-gray-200 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
                    >
                        {id ? "Lihat Portfolio" : "View Portfolio"}
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
