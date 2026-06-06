import ArticlesPage from "@/views/ArticlesPage";
import { getAllArticles } from "@/lib/articles";

export const revalidate = 3600;

export default async function Page() {
    const articles = await getAllArticles();
    return <ArticlesPage articles={articles} />;
}
