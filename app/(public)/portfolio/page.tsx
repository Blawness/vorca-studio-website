import type { Metadata } from "next";
import PortfolioPage from "@/views/PortfolioPage";
import { pageMetadata } from "@/lib/seo";
import { getVisiblePortfolio } from "@/lib/portfolio";

export const metadata: Metadata = pageMetadata({
    title: "Portfolio | Vorca Studio",
    description:
        "Lihat portfolio proyek website, company profile, landing page, dan custom web app yang dikembangkan oleh Vorca Studio.",
    path: "/portfolio",
});

export default async function Page() {
    const projects = await getVisiblePortfolio();
    return <PortfolioPage projects={projects} />;
}
