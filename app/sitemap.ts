import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@blawness/admin-kit/public";

const baseUrl = "https://www.vorcastudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes = [
        { url: "", priority: 1, changeFrequency: "weekly" as const },
        { url: "/services", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/portfolio", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/students", priority: 0.8, changeFrequency: "monthly" as const },
    ];

    const articleEntries = await getSitemapEntries({
        siteUrl: baseUrl,
        articleBasePath: "/articles",
    });

    const formattedArticleEntries: MetadataRoute.Sitemap = articleEntries.map((a) => ({
        url: a.url,
        lastModified: a.lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.64,
    }));

    return [
        ...staticRoutes.map((r) => ({
            url: `${baseUrl}${r.url}`,
            lastModified: new Date(),
            changeFrequency: r.changeFrequency,
            priority: r.priority,
        })),
        { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        ...formattedArticleEntries,
    ];
}
