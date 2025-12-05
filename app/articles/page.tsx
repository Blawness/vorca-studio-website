import ArticlesPage from "@/views/ArticlesPage";
import { getAllArticles } from "@/sanity/lib/fetch";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const articles = await getAllArticles();
    return <ArticlesPage articles={articles} />;
}
