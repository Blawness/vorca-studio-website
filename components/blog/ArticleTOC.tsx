"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

export interface TOCHeading {
    id: string;
    text: string;
    level: 2 | 3;
}

interface ArticleTOCProps {
    headings: TOCHeading[];
    language?: "id" | "en";
}

export default function ArticleTOC({ headings, language = "id" }: ArticleTOCProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    // Track active section using IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-80px 0px -70% 0px",
                threshold: 0,
            }
        );

        // Observe all heading elements
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100; // Account for sticky header
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
        setIsOpen(false); // Close mobile TOC on click
    };

    if (headings.length === 0) return null;

    const tocTitle = language === "id" ? "Daftar Isi" : "Table of Contents";
    const showText = language === "id" ? "Lihat Daftar Isi" : "Show Contents";
    const hideText = language === "id" ? "Sembunyikan" : "Hide";

    return (
        <>
            {/* Mobile TOC - Collapsible */}
            <div className="lg:hidden mb-8">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                        w-full flex items-center justify-between
                        px-4 py-3 rounded-xl
                        bg-gray-800/60 border border-gray-700/50
                        text-gray-300 hover:text-white
                        transition-all duration-200
                    "
                >
                    <span className="flex items-center gap-2 font-medium">
                        <List className="w-4 h-4" />
                        {isOpen ? hideText : showText}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {isOpen && (
                    <nav className="mt-3 p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
                        <ul className="space-y-2">
                            {headings.map(({ id, text, level }) => (
                                <li key={id}>
                                    <button
                                        onClick={() => handleClick(id)}
                                        className={`
                                            w-full text-left px-3 py-2 rounded-lg
                                            text-sm transition-all duration-150
                                            ${level === 3 ? "pl-6" : ""}
                                            ${activeId === id
                                                ? "text-cyan-400 bg-cyan-500/10 font-medium"
                                                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                                            }
                                        `}
                                    >
                                        {text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>

            {/* Desktop TOC - Sticky Sidebar */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                <nav className="sticky top-24">
                    <div className="p-5 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-sm">
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <List className="w-4 h-4" />
                            {tocTitle}
                        </h3>
                        <ul className="space-y-1">
                            {headings.map(({ id, text, level }) => (
                                <li key={id}>
                                    <button
                                        onClick={() => handleClick(id)}
                                        className={`
                                            w-full text-left px-3 py-2 rounded-lg
                                            text-sm transition-all duration-150
                                            border-l-2
                                            ${level === 3 ? "pl-5 ml-2" : ""}
                                            ${activeId === id
                                                ? "text-cyan-400 bg-cyan-500/10 border-l-cyan-500 font-medium"
                                                : "text-gray-400 hover:text-white hover:bg-gray-700/30 border-l-transparent"
                                            }
                                        `}
                                    >
                                        {text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
}
