import "server-only";
import { uploadImage } from "@blawness/admin-kit";

/**
 * Takes a screenshot of `url` via Microlink and stores it in R2.
 * Returns the public R2 URL. Throws on any failure.
 */
export async function captureThumbnail(url: string, slug: string): Promise<string> {
    const qs = new URLSearchParams({
        url,
        screenshot: "true",
        meta: "false",
        waitUntil: "networkidle2",
        "viewport.width": "1280",
        "viewport.height": "800",
    });
    const headers: Record<string, string> = {};
    if (process.env.MICROLINK_API_KEY) headers["x-api-key"] = process.env.MICROLINK_API_KEY;

    const meta = await fetch(`https://api.microlink.io/?${qs}`, { headers, cache: "no-store" });
    if (!meta.ok) throw new Error(`Microlink ${meta.status}`);
    const json = (await meta.json()) as { status: string; data?: { screenshot?: { url?: string } } };
    const shotUrl = json.data?.screenshot?.url;
    if (json.status !== "success" || !shotUrl) throw new Error("Microlink returned no screenshot");

    const img = await fetch(shotUrl, { cache: "no-store" });
    if (!img.ok) throw new Error(`Screenshot download ${img.status}`);
    const buffer = Buffer.from(await img.arrayBuffer());

    const { url: r2Url } = await uploadImage(buffer, `portfolio/${slug}`);
    return r2Url;
}
