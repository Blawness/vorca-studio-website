import type { Metadata } from "next";
import ServicesPage from "@/views/ServicesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Layanan Web Development | Vorca Studio",
    description:
        "Layanan web development Vorca Studio untuk bisnis Indonesia, mulai dari landing page, company profile, hingga custom web app modern berbasis Next.js.",
    path: "/services",
});

export default function Page() {
    return <ServicesPage />;
}
