import { createClient } from "@sanity/client";
import { marked } from "marked";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { rm } from "node:fs/promises";
import { buildArticleHtml } from "../lib/article-html";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const DRY_RUN = process.env.DRY_RUN === "1";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "zdgfq7md";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!process.env.DATABASE_URL && !DRY_RUN) {
    throw new Error("DATABASE_URL is required to run the real migration.");
}

const sanity = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const GROQ = `*[_type == "article"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  content,
  image,
  category,
  author,
  date,
  readTime,
  tags
}`;

type SanityArticle = {
    _id: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    category?: string;
    author?: string;
    date?: string;
    readTime?: number;
    tags?: string[];
};

function normalizeTags(tags: unknown): string[] {
    return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
}

async function convertMarkdown(markdown: string): Promise<string> {
    const html = await marked(markdown, { async: false });
    return buildArticleHtml(html);
}

const sanityArticles = await sanity.fetch<SanityArticle[]>(GROQ);
console.log(`Fetched ${sanityArticles.length} articles from Sanity (${projectId}/${dataset}).`);

const database =
    DRY_RUN
        ? null
        : {
            db: (await import("../db")).db,
            articles: (await import("../db/schema")).articles,
        };

let inserted = 0;
let updated = 0;
let skipped = 0;
let errored = 0;

for (const source of sanityArticles) {
    try {
        if (!source.slug || !source.title) {
            console.warn(`  Skipped: ${source._id} is missing slug or title.`);
            skipped += 1;
            continue;
        }

        const publishedAt = source.date ? new Date(source.date) : new Date();
        if (Number.isNaN(publishedAt.getTime())) {
            throw new Error(`Invalid date: ${source.date}`);
        }

        const content = await convertMarkdown(source.content ?? "");

        const values = {
            title: source.title,
            slug: source.slug,
            excerpt: source.excerpt ?? "",
            content,
            coverImageUrl: source.image ?? null,
            category: source.category ?? "Technology",
            author: source.author ?? "Vorca Studio",
            publishedAt,
            readTime: source.readTime ?? 5,
            tags: normalizeTags(source.tags),
            status: "published",
            updatedAt: new Date(),
        };

        if (DRY_RUN) {
            console.log(`  DRY convert: ${source.slug} (${content.length} html chars)`);
            inserted += 1;
        } else {
            if (!database) throw new Error("Database client was not initialized.");
            const { db, articles } = database;
            const existing = await db
                .select({ id: articles.id })
                .from(articles)
                .where(eq(articles.slug, source.slug))
                .limit(1);

            if (existing.length > 0) {
                await db.update(articles).set(values).where(eq(articles.slug, source.slug));
                console.log(`  Updated: ${source.slug}`);
                updated += 1;
            } else {
                await db.insert(articles).values({ ...values, createdAt: publishedAt });
                console.log(`  Inserted: ${source.slug}`);
                inserted += 1;
            }
        }
    } catch (error) {
        console.error(`  ERROR on ${source.slug ?? source._id}:`, error);
        errored += 1;
    }
}

const prefix = DRY_RUN ? "Dry run done." : "Done.";
console.log(
    `\n${prefix} Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}, Errors: ${errored}`,
);

if (!DRY_RUN && errored === 0) {
    await Promise.all([
        rm(".next/cache/fetch-cache", { recursive: true, force: true }),
        rm(".next/dev/cache/fetch-cache", { recursive: true, force: true }),
    ]);
    console.log("Cleared local Next fetch cache.");
}

process.exit(errored > 0 ? 1 : 0);
