import { renderOgImage, size, contentType } from "@/lib/og";
import { getArticleBySlug } from "@/lib/articles";

export const alt = "Artikel Vorca Studio";
export { size, contentType };

// Fallback card for articles without a cover image. When a cover exists,
// `generateMetadata` sets `openGraph.images` explicitly and that wins over
// this file-convention image.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    return renderOgImage({
        eyebrow: article?.category || "Artikel",
        title: article?.title ?? "Artikel Vorca Studio",
    });
}
