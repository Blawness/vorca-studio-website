import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import SiteChrome from "@/components/SiteChrome";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
    title: {
        default: "Vorca Studio | Jasa Web Development & Custom Web App Indonesia",
        template: "%s | Vorca Studio",
    },
    description:
        "Vorca Studio adalah studio pengembangan website dan web app modern berbasis Next.js di Indonesia. Dari landing page, company profile, hingga custom web app untuk bisnis Anda.",
    metadataBase: new URL("https://www.vorcastudio.com"),
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://www.vorcastudio.com",
        siteName: "Vorca Studio",
        title: "Vorca Studio | Jasa Web Development & Custom Web App Indonesia",
        description:
            "Studio pengembangan website dan web app modern berbasis Next.js untuk bisnis Indonesia.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Vorca Studio | Jasa Web Development & Custom Web App Indonesia",
        description:
            "Studio pengembangan website dan web app modern berbasis Next.js untuk bisnis Indonesia.",
    },
    alternates: {
        canonical: "https://www.vorcastudio.com",
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", type: "image/x-icon" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://www.vorcastudio.com/#organization",
            name: "Vorca Studio",
            url: "https://www.vorcastudio.com",
            logo: {
                "@type": "ImageObject",
                url: "https://www.vorcastudio.com/favicon.svg",
            },
            description:
                "Vorca Studio adalah studio pengembangan website dan web app modern berbasis Next.js di Indonesia, melayani kebutuhan bisnis dari landing page hingga sistem operasional kompleks.",
            foundingLocation: { "@type": "Place", addressCountry: "ID" },
            contactPoint: {
                "@type": "ContactPoint",
                telephone: "+62-851-6700-2152",
                contactType: "customer service",
                availableLanguage: ["Indonesian", "English"],
            },
            email: "marketing@vorcastudio.com",
            sameAs: ["https://www.instagram.com/vorcastudio"],
            knowsAbout: [
                "Next.js Development",
                "Web Application Development",
                "Full-Stack Development",
                "Custom Web App",
                "Business Web Systems",
            ],
        },
        {
            "@type": "WebSite",
            "@id": "https://www.vorcastudio.com/#website",
            url: "https://www.vorcastudio.com",
            name: "Vorca Studio",
            publisher: { "@id": "https://www.vorcastudio.com/#organization" },
        },
        {
            "@type": "ProfessionalService",
            "@id": "https://www.vorcastudio.com/#service",
            name: "Vorca Studio",
            description:
                "Jasa pembuatan website dan custom web app berbasis Next.js - landing page, company profile, hingga sistem bisnis kompleks.",
            url: "https://www.vorcastudio.com",
            areaServed: "ID",
            serviceType: "Web Development",
            provider: { "@id": "https://www.vorcastudio.com/#organization" },
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Layanan Vorca Studio",
                itemListElement: [
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Landing Page Development",
                        },
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Company Profile Website",
                        },
                    },
                    {
                        "@type": "Offer",
                        itemOffered: {
                            "@type": "Service",
                            name: "Custom Web App Development",
                        },
                    },
                ],
            },
        },
    ],
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
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </head>
            <body className="min-h-screen bg-black text-white">
                <Providers>
                    <SiteChrome>{children}</SiteChrome>
                    <Toaster />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
