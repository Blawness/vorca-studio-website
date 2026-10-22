import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";

export type PortfolioItem = {
    slug: string;
    title: string;
    url: string;
    category: string;
    description: { id: string; en: string };
    tags: string[];
    thumbnailUrl: string | null;
};

/** Items the admin has toggled visible, in display order. Tag: `portfolio`. */
export async function getVisiblePortfolio(): Promise<PortfolioItem[]> {
    "use cache";
    cacheTag("portfolio");
    cacheLife("hours");

    const rows = await db
        .select()
        .from(portfolioItems)
        .where(eq(portfolioItems.visible, true))
        .orderBy(asc(portfolioItems.sortOrder), desc(portfolioItems.createdAt));

    return rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        url: r.url,
        category: r.category,
        description: {
            id: r.descriptionId ?? r.descriptionEn ?? "",
            en: r.descriptionEn ?? r.descriptionId ?? "",
        },
        tags: r.tags,
        thumbnailUrl: r.thumbnailUrl,
    }));
}
