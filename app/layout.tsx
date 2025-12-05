import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import CustomerServiceButton from "@/components/CustomerServiceButton";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
    title: "Vorca Studio Website",
    description: "Jasa Pembuatan Website & Aplikasi Profesional",
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", type: "image/x-icon" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#06b6d4",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className="min-h-screen bg-black text-white">
                <Providers>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <Toaster />
                    <CustomerServiceButton />
                </Providers>
            </body>
        </html>
    );
}
