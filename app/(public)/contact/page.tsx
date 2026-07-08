import type { Metadata } from "next";
import ContactPage from "@/views/ContactPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Kontak & Konsultasi Gratis | Vorca Studio",
    description:
        "Hubungi Vorca Studio untuk konsultasi gratis pembuatan website, landing page, company profile, atau custom web app untuk bisnis Anda.",
    path: "/contact",
});

export default function Page() {
    return <ContactPage />;
}
