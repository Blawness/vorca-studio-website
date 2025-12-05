import ArticleDetailPage from "@/views/ArticleDetailPage";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const articles = await import("@/app/data/articles.json");
    const article = articles.default.find((a: any) => a.slug === slug);

    if (!article) {
        return {
            title: 'Article Not Found | Vorca Studio',
            description: 'The requested article could not be found.',
        };
    }

    return {
        title: `${article.titleEn} | Vorca Studio`,
        description: article.excerptEn,
        openGraph: {
            title: article.titleEn,
            description: article.excerptEn,
            url: `https://vorcastudio.com/articles/${slug}`,
            siteName: 'Vorca Studio',
            images: [
                {
                    url: article.image,
                    width: 1200,
                    height: 630,
                    alt: article.titleEn,
                },
            ],
            locale: 'en_US',
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
    return <ArticleDetailPage slug={slug} />;
}

// Generate static params for all articles
export async function generateStaticParams() {
    const articles = await import("@/app/data/articles.json");
    return articles.default.map((article: { slug: string }) => ({
        slug: article.slug,
    }));
}
