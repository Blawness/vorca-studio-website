import ArticleDetailPage from "@/views/ArticleDetailPage";
import { getArticleBySlug, getAllArticles, getAllSlugs } from "@/sanity/lib/fetch";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Article Not Found | Vorca Studio',
            description: 'The requested article could not be found.',
        };
    }

    return {
        title: `${article.title} | Vorca Studio`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `https://vorcastudio.com/articles/${slug}`,
            siteName: 'Vorca Studio',
            images: [
                {
                    url: article.image,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            locale: 'id_ID',
            type: 'article',
        },
        alternates: {
            canonical: `https://vorcastudio.com/articles/${slug}`,
        },
        keywords: article.tags,
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    // Get related articles (same category)
    let relatedArticles: Awaited<ReturnType<typeof getAllArticles>> = [];
    if (article) {
        const allArticles = await getAllArticles();
        relatedArticles = allArticles
            .filter((a) => a.category === article.category && a.id !== article.id)
            .slice(0, 3);
    }

    return <ArticleDetailPage article={article} relatedArticles={relatedArticles} />;
}

// Generate static params for all articles
export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((item) => ({
        slug: item.slug,
    }));
}
