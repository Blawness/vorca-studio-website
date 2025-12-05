"use client";

import { ReactNode, useMemo } from "react";
import Link from "next/link";
import Callout from "./Callout";
import PullQuote from "./PullQuote";
import TestingToolsGrid from "./TestingToolsGrid";
import { TOCHeading } from "./ArticleTOC";

interface ArticleBodyProps {
    content: string;
    language?: "id" | "en";
    onHeadingsExtracted?: (headings: TOCHeading[]) => void;
}

// Helper to generate slug from heading text
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

// Parse inline markdown (bold, italic, links)
function parseInlineFormatting(text: string): ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/);

    return parts.map((part, i) => {
        // Bold text
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className="text-cyan-400 font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        // Italic text
        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
            return (
                <em key={i} className="text-gray-200 italic">
                    {part.slice(1, -1)}
                </em>
            );
        }
        // Links
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
            const [, linkText, linkUrl] = linkMatch;
            return (
                <Link
                    key={i}
                    href={linkUrl}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors font-medium"
                >
                    {linkText}
                </Link>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export default function ArticleBody({
    content,
    language = "id",
}: ArticleBodyProps) {
    // Parse content and extract headings for TOC
    const { elements, headings } = useMemo(() => {
        const paragraphs = content.split("\n\n");
        const extractedHeadings: TOCHeading[] = [];

        const parsedElements = paragraphs.map((paragraph, index) => {
            // Check for H2
            if (paragraph.startsWith("## ")) {
                const text = paragraph.replace("## ", "");
                const id = slugify(text);
                extractedHeadings.push({ id, text, level: 2 });

                return (
                    <h2
                        key={index}
                        id={id}
                        className="
                            text-2xl md:text-3xl font-bold text-white
                            mt-14 mb-6 pb-3
                            border-b border-cyan-500/20
                            scroll-mt-24
                        "
                    >
                        {text}
                    </h2>
                );
            }

            // Check for H3
            if (paragraph.startsWith("### ")) {
                const text = paragraph.replace("### ", "");
                const id = slugify(text);
                extractedHeadings.push({ id, text, level: 3 });

                return (
                    <h3
                        key={index}
                        id={id}
                        className="
                            text-xl md:text-2xl font-semibold text-white
                            mt-10 mb-4
                            scroll-mt-24
                        "
                    >
                        {text}
                    </h3>
                );
            }

            // Unordered list
            if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n");
                return (
                    <ul key={index} className="list-none space-y-3 my-6 pl-1">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start text-gray-300 leading-relaxed">
                                <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2.5 mr-4 flex-shrink-0" />
                                <span className="flex-1">{parseInlineFormatting(item.replace("- ", ""))}</span>
                            </li>
                        ))}
                    </ul>
                );
            }

            // Ordered list
            if (/^\d+\./.test(paragraph)) {
                const items = paragraph.split("\n");
                return (
                    <ol key={index} className="list-none space-y-4 my-6">
                        {items.map((item, i) => {
                            const itemContent = item.replace(/^\d+\.\s*/, "");
                            return (
                                <li key={i} className="flex items-start text-gray-300 leading-relaxed">
                                    <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-black text-sm font-bold mr-4 flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1">{parseInlineFormatting(itemContent)}</span>
                                </li>
                            );
                        })}
                    </ol>
                );
            }

            // Regular paragraph
            return (
                <p key={index} className="text-gray-300 leading-relaxed text-lg mb-6">
                    {parseInlineFormatting(paragraph)}
                </p>
            );
        });

        return { elements: parsedElements, headings: extractedHeadings };
    }, [content]);

    // Check if this is the performance optimization article
    const isPerformanceArticle = content.includes("Faktor yang Mempengaruhi Kecepatan") ||
        content.includes("Factors Affecting Speed");
    const hasToolsSection = content.includes("Tools untuk Testing") ||
        content.includes("Testing Tools");

    return (
        <div className="prose prose-lg prose-invert max-w-none">
            {/* Pull Quote - Opening statement for emphasis */}
            {isPerformanceArticle && (
                <PullQuote>
                    {language === "id"
                        ? "Kecepatan website memiliki dampak langsung terhadap SEO dan user experience."
                        : "Website speed has a direct impact on SEO and user experience."
                    }
                </PullQuote>
            )}

            {elements.map((element, index) => {
                // Insert callouts at specific points for the performance article
                if (isPerformanceArticle) {
                    // After the "Optimasi Gambar" section
                    if (element?.props?.children === "1. Optimasi Gambar" ||
                        element?.props?.children === "1. Image Optimization") {
                        return (
                            <div key={index}>
                                {element}
                                <Callout type="performance" title={language === "id" ? "Tips Performa" : "Performance Tip"}>
                                    {language === "id"
                                        ? "Gunakan format WebP untuk gambar - dapat mengurangi ukuran file hingga 30% dibanding JPEG tanpa kehilangan kualitas visual."
                                        : "Use WebP format for images - can reduce file size by up to 30% compared to JPEG without losing visual quality."
                                    }
                                </Callout>
                            </div>
                        );
                    }

                    // After the "Caching Strategy" section heading
                    if (element?.props?.children === "3. Caching Strategy" ||
                        element?.props?.children === "3. Strategi Caching") {
                        return (
                            <div key={index}>
                                {element}
                                <Callout type="tip" title={language === "id" ? "Pro Tip" : "Pro Tip"}>
                                    {language === "id"
                                        ? "Implementasikan browser caching untuk aset statis dengan Cache-Control header. Ini dapat mengurangi waktu loading hingga 80% untuk pengunjung berulang."
                                        : "Implement browser caching for static assets with Cache-Control headers. This can reduce loading time by up to 80% for returning visitors."
                                    }
                                </Callout>
                            </div>
                        );
                    }

                    // Replace tools bullet list with grid
                    if (hasToolsSection &&
                        (element?.props?.children === "Tools untuk Testing" ||
                            element?.props?.children === "Testing Tools")) {
                        return (
                            <div key={index}>
                                {element}
                                <TestingToolsGrid language={language} />
                            </div>
                        );
                    }

                    // Skip the original tools list if we're showing the grid
                    if (hasToolsSection && element?.type === "ul") {
                        const listContent = element.props.children;
                        if (Array.isArray(listContent)) {
                            const firstItem = listContent[0]?.props?.children;
                            if (firstItem && typeof firstItem === "object") {
                                // Check if this is the tools list by checking for PageSpeed mention
                                const itemText = firstItem[1]?.props?.children;
                                if (typeof itemText === "string" && itemText.includes("Google PageSpeed")) {
                                    return null; // Skip the original bullet list
                                }
                            }
                        }
                    }
                }

                return element;
            })}
        </div>
    );
}

// Export headings extraction function for use in parent component
export function extractHeadings(content: string): TOCHeading[] {
    const paragraphs = content.split("\n\n");
    const headings: TOCHeading[] = [];

    paragraphs.forEach((paragraph) => {
        if (paragraph.startsWith("## ")) {
            const text = paragraph.replace("## ", "");
            headings.push({ id: slugify(text), text, level: 2 });
        } else if (paragraph.startsWith("### ")) {
            const text = paragraph.replace("### ", "");
            headings.push({ id: slugify(text), text, level: 3 });
        }
    });

    return headings;
}
