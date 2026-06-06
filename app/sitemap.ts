import type { MetadataRoute } from "next";

const baseUrl = "https://www.vorcastudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/services",
        "/about",
        "/portfolio",
        "/contact",
        "/articles",
        "/students",
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
    }));
}
