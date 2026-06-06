import { db } from "../db";
import { articles } from "../db/schema";
import { eq, isNotNull } from "drizzle-orm";
import { uploadImage, slugify } from "@blawness/admin-kit";

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
if (!R2_PUBLIC_URL) {
    console.error("R2_PUBLIC_URL is not set");
    process.exit(1);
}

async function downloadAsBuffer(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
}

async function main() {
    const rows = await db
        .select({
            id: articles.id,
            title: articles.title,
            coverImageUrl: articles.coverImageUrl,
        })
        .from(articles)
        .where(isNotNull(articles.coverImageUrl));

    console.log(`Found ${rows.length} articles with cover images.`);

    let copied = 0;
    let skipped = 0;
    let errored = 0;

    for (const row of rows) {
        const url = row.coverImageUrl!;
        if (url.startsWith(R2_PUBLIC_URL)) {
            console.log(`  SKIP (already R2): ${row.title}`);
            skipped++;
            continue;
        }

        try {
            const buffer = await downloadAsBuffer(url);
            const keyBase = `covers/${slugify(row.title)}`;
            const { url: r2Url } = await uploadImage(buffer, keyBase);

            await db
                .update(articles)
                .set({ coverImageUrl: r2Url, updatedAt: new Date() })
                .where(eq(articles.id, row.id));

            console.log(`  Copied: ${row.title} \u2192 ${r2Url}`);
            copied++;
        } catch (err) {
            console.error(`  ERROR on "${row.title}":`, err);
            errored++;
        }
    }

    console.log(`\nDone. Copied: ${copied}, Skipped: ${skipped}, Errors: ${errored}`);
    process.exit(errored > 0 ? 1 : 0);
}

main();
