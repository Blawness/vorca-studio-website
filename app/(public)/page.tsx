import type { Metadata } from "next";
import HomePage from "@/views/HomePage";

// Title/description/openGraph come from the root layout, which already
// describes the homepage. Only the canonical is page-specific.
export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default function Page() {
    return <HomePage />;
}
