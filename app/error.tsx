"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#050b16] px-4">
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.14)_0%,transparent_70%)]" />
            </div>
            <div className="relative z-10 text-center animate-fadeInUp">
                <p className="text-6xl sm:text-7xl font-bold bg-gradient-to-br from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent mb-3">
                    Oops
                </p>
                <h1 className="text-2xl font-semibold text-white mb-2">
                    Ada yang tidak beres
                </h1>
                <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                    Terjadi kesalahan tak terduga. Coba muat ulang halaman — kalau masih
                    berlanjut, hubungi kami.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all duration-300"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-medium text-gray-200 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
                    >
                        <Home className="w-4 h-4" />
                        Beranda
                    </Link>
                </div>
            </div>
        </section>
    );
}
