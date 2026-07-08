import type { Metadata } from "next";
import PortfolioPage from "@/views/PortfolioPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Portfolio | Vorca Studio",
    description:
        "Lihat portfolio proyek website, company profile, landing page, dan custom web app yang dikembangkan oleh Vorca Studio.",
    path: "/portfolio",
});

export default function Page() {
    return <PortfolioPage />;
}
