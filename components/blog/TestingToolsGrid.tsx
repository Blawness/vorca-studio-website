"use client";

import { ExternalLink } from "lucide-react";

interface Tool {
    name: string;
    description: string;
    url: string;
}

interface TestingToolsGridProps {
    tools?: Tool[];
    language?: "id" | "en";
}

// Default testing tools data
const defaultTools: Tool[] = [
    {
        name: "Google PageSpeed Insights",
        description: "Analisis performa dan rekomendasi optimasi dari Google untuk desktop dan mobile.",
        url: "https://pagespeed.web.dev/",
    },
    {
        name: "GTmetrix",
        description: "Laporan detail performa dengan waterfall chart dan monitoring historis.",
        url: "https://gtmetrix.com/",
    },
    {
        name: "WebPageTest",
        description: "Testing performa website dari berbagai lokasi dengan analisis mendalam.",
        url: "https://www.webpagetest.org/",
    },
];

export default function TestingToolsGrid({
    tools = defaultTools,
    language = "id",
}: TestingToolsGridProps) {
    const ctaText = language === "id" ? "Kunjungi" : "Visit";

    return (
        <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                    <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            group block p-5
                            bg-gray-800/50 backdrop-blur-sm
                            border border-gray-700/50 rounded-xl
                            hover:bg-gray-800 hover:border-cyan-500/30
                            hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10
                            transition-all duration-200
                        "
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                                    {tool.name}
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                                    {tool.description}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <span
                                    className="
                                        inline-flex items-center gap-1.5
                                        px-3 py-1.5 rounded-lg
                                        text-sm font-medium
                                        bg-cyan-500/10 text-cyan-400
                                        group-hover:bg-cyan-500 group-hover:text-black
                                        transition-all duration-200
                                    "
                                >
                                    {ctaText}
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
