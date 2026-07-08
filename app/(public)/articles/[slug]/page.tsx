import ArticleDetailPage from "@/views/ArticleDetailPage";
import { buildArticleHtml, extractHeadingsFromHtml } from "@/lib/article-html";
import { getArticleBySlug, getAllArticles, getAllSlugs } from "@/lib/articles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: { absolute: 'Article Not Found | Vorca Studio' },
            description: 'The requested article could not be found.',
            robots: { index: false, follow: true },
        };
    }

    // `title` as a plain string would pick up the root layout's
    // `template: "%s | Vorca Studio"` and render "… | Vorca Studio | Vorca Studio".
    const title = `${article.title} | Vorca Studio`;
    const path = `/articles/${slug}`;

    // An article without a cover falls through to this segment's
    // `opengraph-image.tsx`. The key must be *absent*, not set to `undefined` —
    // Next treats a present `images` key as "caller specified images" and drops
    // the file-convention image either way.
    const images = article.image
        ? { images: [{ url: article.image, width: 1200, height: 630, alt: article.title }] }
        : {};

    return {
        title: { absolute: title },
        description: article.excerpt,
        openGraph: {
            type: 'article',
            locale: 'id_ID',
            siteName: 'Vorca Studio',
            url: path,
            title: article.title,
            description: article.excerpt,
            ...images,
            publishedTime: article.date,
            tags: article.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            ...images,
        },
        alternates: {
            canonical: path,
        },
        keywords: article.tags,
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) notFound();

    const contentHtml = buildArticleHtml(article.content);
    const headings = extractHeadingsFromHtml(contentHtml);

    // Get related articles (same category)
    let relatedArticles: Awaited<ReturnType<typeof getAllArticles>> = [];
    const allArticles = await getAllArticles();
    relatedArticles = allArticles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 3);

    return (
        <ArticleDetailPage
            article={article}
            contentHtml={contentHtml}
            headings={headings}
            relatedArticles={relatedArticles}
        />
    );
}

// Generate static params for all articles
export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}
