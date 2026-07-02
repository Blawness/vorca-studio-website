"use client";

import { TOCHeading } from "./ArticleTOC";

interface ArticleBodyProps {
    content: string;
    language?: "id" | "en";
    onHeadingsExtracted?: (headings: TOCHeading[]) => void;
}

function stripTags(value: string): string {
    return value.replace(/<[^>]+>/g, "").trim();
}

export function extractHeadings(content: string): TOCHeading[] {
    const headings: TOCHeading[] = [];
    const re = /<(h[23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
    let match: RegExpExecArray | null;

    while ((match = re.exec(content)) !== null) {
        headings.push({
            id: match[2],
            text: stripTags(match[3]),
            level: Number(match[1].replace("h", "")) as 2 | 3,
        });
    }

    return headings;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
    return (
        <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
