import {
    getPublishedArticles,
    getPublishedArticleBySlug,
    getPublishedArticleSlugs,
} from "@blawness/admin-kit/public";

export type Article = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: number;
    tags: string[];
};

export async function getAllArticles(): Promise<Article[]> {
    const rawArticles = await getPublishedArticles();
    return rawArticles.map((raw) => ({
        id: raw.id,
        slug: raw.slug,
        title: raw.title,
        excerpt: raw.excerpt ?? "",
        content: "",
        image: raw.coverImageUrl?.trim() ? raw.coverImageUrl : "",
        category: raw.categoryName ?? "",
        author: raw.authorName ?? "Vorca Studio",
        date: raw.publishedAt?.toISOString() ?? new Date().toISOString(),
        readTime: 5,
        tags: [],
    }));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const raw = await getPublishedArticleBySlug(slug);
    if (!raw) return null;

    return {
        id: raw.id,
        slug: raw.slug,
        title: raw.title,
        excerpt: raw.excerpt ?? "",
        content: raw.content ?? "",
        image: raw.coverImageUrl?.trim() ? raw.coverImageUrl : "",
        category: raw.categoryName ?? "",
        author: raw.authorName ?? "Vorca Studio",
        date: raw.publishedAt?.toISOString() ?? raw.updatedAt?.toISOString() ?? new Date().toISOString(),
        readTime: 5, // We can calculate read time based on content length or leave as default
        tags: raw.tags.map((t) => t.name),
    };
}

export async function getAllSlugs(): Promise<string[]> {
    return await getPublishedArticleSlugs();
}

