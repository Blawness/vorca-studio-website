import type { Metadata } from "next";
import AboutPage from "@/views/AboutPage";

export const metadata: Metadata = {
    title: { absolute: "Tentang Vorca Studio | Web Development Agency Indonesia" },
    description:
        "Kenali Vorca Studio, web development agency Indonesia yang membangun website dan aplikasi web modern untuk kebutuhan bisnis.",
};

export default function Page() {
    return <AboutPage />;
}
