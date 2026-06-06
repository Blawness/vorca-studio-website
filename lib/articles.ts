import { db } from "@/db";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const FALLBACK_ARTICLE_IMAGE = "/icon-512x512.png";

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

function mapRow(row: typeof articles.$inferSelect): Article {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        image: row.coverImageUrl ?? FALLBACK_ARTICLE_IMAGE,
        category: row.category,
        author: row.author,
        date: row.publishedAt?.toISOString() ?? row.createdAt.toISOString(),
        readTime: row.readTime,
        tags: row.tags,
    };
}

export const getAllArticles = unstable_cache(
    async (): Promise<Article[]> => {
        const rows = await db
            .select()
            .from(articles)
            .where(eq(articles.status, "published"))
            .orderBy(desc(articles.publishedAt), desc(articles.createdAt));

        return rows.map(mapRow);
    },
    ["articles-list"],
    { tags: ["articles"], revalidate: 3600 },
);

export const getArticleBySlug = unstable_cache(
    async (slug: string): Promise<Article | null> => {
        const [row] = await db
            .select()
            .from(articles)
            .where(eq(articles.slug, slug))
            .limit(1);

        if (!row || row.status !== "published") return null;

        return mapRow(row);
    },
    ["article-by-slug"],
    { tags: ["articles"], revalidate: 3600 },
);

export const getAllSlugs = unstable_cache(
    async (): Promise<string[]> => {
        const rows = await db
            .select({ slug: articles.slug })
            .from(articles)
            .where(eq(articles.status, "published"));

        return rows.map((row) => row.slug);
    },
    ["articles-slugs"],
    { tags: ["articles"], revalidate: 3600 },
);
