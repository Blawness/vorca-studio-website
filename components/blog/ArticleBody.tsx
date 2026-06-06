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
            className="prose prose-lg prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:text-white prose-h2:mt-14 prose-h2:border-b prose-h2:border-cyan-500/20 prose-h2:pb-3 prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:underline-offset-4 prose-strong:text-cyan-400 prose-blockquote:border-cyan-500/50 prose-blockquote:text-gray-200 prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
