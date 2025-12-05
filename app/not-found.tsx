"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050b16] flex items-center justify-center px-4">
            <div className="text-center animate-fadeIn">
                <h1 className="text-9xl font-bold text-cyan-500 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold">
                    <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}

