import type { Metadata } from "next";
import ServicesPage from "@/views/ServicesPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: { absolute: "Layanan Web Development | Vorca Studio" },
    description:
        "Layanan web development Vorca Studio untuk bisnis Indonesia, mulai dari landing page, company profile, hingga custom web app modern berbasis Next.js.",
};

export default function Page() {
    return <ServicesPage />;
}
