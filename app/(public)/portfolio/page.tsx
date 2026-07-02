import type { Metadata } from "next";
import PortfolioPage from "@/views/PortfolioPage";

export const metadata: Metadata = {
    title: { absolute: "Portfolio | Vorca Studio" },
    description:
        "Lihat portfolio proyek website, company profile, landing page, dan custom web app yang dikembangkan oleh Vorca Studio.",
};

export default function Page() {
    return <PortfolioPage />;
}
