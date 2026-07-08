import type { Metadata } from "next";

interface PageMetadataOptions {
    /** Full <title>, used verbatim (no "| Vorca Studio" template applied). */
    title: string;
    description: string;
    /** Root-relative path, e.g. "/services". Resolved against `metadataBase`. */
    path: string;
}

/**
 * Build per-page metadata.
 *
 * Next merges metadata shallowly: `openGraph` and `twitter` are replaced
 * wholesale by a child route, never deep-merged. So a page that sets only
 * `title` inherits the *root layout's* og:title — which is why every page must
 * declare a complete openGraph block. Same story for `alternates.canonical`.
 * This helper keeps that boilerplate in one place.
 *
 * `images` is deliberately omitted so the `opengraph-image` file convention
 * supplies the card art.
 */
export function pageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            locale: "id_ID",
            siteName: "Vorca Studio",
            url: path,
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
