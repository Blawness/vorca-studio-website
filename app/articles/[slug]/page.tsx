import ArticleDetailPage from "@/views/ArticleDetailPage";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    return <ArticleDetailPage slug={slug} />;
}

// Generate static params for all articles
export async function generateStaticParams() {
    const articles = await import("@/app/data/articles.json");
    return articles.default.map((article: { slug: string }) => ({
        slug: article.slug,
    }));
}
