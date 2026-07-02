import sanitizeHtmlLib from "sanitize-html";
import type { TOCHeading } from "@/components/blog/ArticleTOC";

export function sanitizeArticleHtml(content: string): string {
    return sanitizeHtmlLib(content, {
        allowedTags: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "s",
            "h2",
            "h3",
            "h4",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a",
            "img",
            "figure",
            "figcaption",
            "hr",
            "code",
            "pre",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
        ],
        allowedAttributes: {
            a: ["href", "rel", "title"],
            h2: ["id"],
            h3: ["id"],
            h4: ["id"],
            img: ["src", "alt", "title"],
            code: ["class"],
            th: ["colspan", "rowspan", "scope"],
            td: ["colspan", "rowspan"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        allowedSchemesByTag: { img: ["http", "https"] },
        allowProtocolRelative: false,
    });
}

function decodeHtmlEntities(value: string): string {
    return value
        .replace(/&#(\d+);/g, (entity: string, code: string) => {
            const value = Number(code);
            return Number.isInteger(value) && value >= 0 && value <= 0x10ffff
                ? String.fromCodePoint(value)
                : entity;
        })
        .replace(/&#x([0-9a-f]+);/gi, (entity: string, code: string) => {
            const value = parseInt(code, 16);
            return Number.isInteger(value) && value >= 0 && value <= 0x10ffff
                ? String.fromCodePoint(value)
                : entity;
        })
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function stripTags(value: string): string {
    return decodeHtmlEntities(value.replace(/<[^>]+>/g, "").trim());
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function addHeadingIds(html: string): string {
    const used = new Set<string>();

    html.replace(/<h[23]\b[^>]*\bid="([^"]+)"[^>]*>/gi, (_match, id: string) => {
        used.add(id);
        return "";
    });

    return html.replace(
        /<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi,
        (match: string, tag: string, attributes: string, inner: string) => {
            if (/\bid=/.test(attributes)) return match;

            const base = slugify(stripTags(inner)) || "section";
            let id = base;
            let suffix = 2;

            while (used.has(id)) {
                id = `${base}-${suffix}`;
                suffix += 1;
            }

            used.add(id);

            return `<${tag}${attributes} id="${id}">${inner}</${tag}>`;
        },
    );
}

export function buildArticleHtml(content: string): string {
    return addHeadingIds(sanitizeArticleHtml(content));
}

export function extractHeadingsFromHtml(html: string): TOCHeading[] {
    const headings: TOCHeading[] = [];
    const re = /<(h[23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
    let match: RegExpExecArray | null;

    while ((match = re.exec(html)) !== null) {
        headings.push({
            id: match[2],
            text: stripTags(match[3]),
            level: Number(match[1].replace("h", "")) as 2 | 3,
        });
    }

    return headings;
}
