import type { Metadata } from "next";
import ContactPage from "@/views/ContactPage";

export const metadata: Metadata = {
    title: { absolute: "Kontak & Konsultasi Gratis | Vorca Studio" },
    description:
        "Hubungi Vorca Studio untuk konsultasi gratis pembuatan website, landing page, company profile, atau custom web app untuk bisnis Anda.",
};

export default function Page() {
    return <ContactPage />;
}
