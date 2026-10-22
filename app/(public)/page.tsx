import type { Metadata } from "next";
import HomePage from "@/views/HomePage";
import { getVisiblePortfolio } from "@/lib/portfolio";

// Title/description/openGraph come from the root layout, which already
// describes the homepage. Only the canonical is page-specific.
export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default async function Page() {
    const portfolio = await getVisiblePortfolio();
    return <HomePage portfolio={portfolio} />;
}
