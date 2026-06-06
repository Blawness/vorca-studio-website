import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "Googlebot",
                allow: "/",
            },
            {
                userAgent: "*",
                allow: "/",
            },
        ],
        sitemap: "https://www.vorcastudio.com/sitemap.xml",
        host: "https://www.vorcastudio.com",
    };
}
