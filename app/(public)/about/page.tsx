import type { Metadata } from "next";
import AboutPage from "@/views/AboutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Tentang Vorca Studio | Web Development Agency Indonesia",
    description:
        "Kenali Vorca Studio, web development agency Indonesia yang membangun website dan aplikasi web modern untuk kebutuhan bisnis.",
    path: "/about",
});

export default function Page() {
    return <AboutPage />;
}
