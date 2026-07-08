import type { Metadata } from "next";
import ArticlesPage from "@/views/ArticlesPage";
import { getAllArticles } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Artikel & Insight Web Development | Vorca Studio",
    description:
        "Tips, tutorial, dan insight seputar pengembangan web, UI/UX, dan bisnis digital dari tim Vorca Studio.",
    path: "/articles",
});

export default async function Page() {
    const articles = await getAllArticles();
    return <ArticlesPage articles={articles} />;
}
