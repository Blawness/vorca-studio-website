"use client";

import { Tag } from "lucide-react";

interface TagListProps {
    tags: string[];
    label?: string;
}

export default function TagList({ tags, label = "Tags:" }: TagListProps) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 font-medium">{label}</span>
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="
                        inline-flex items-center gap-1.5
                        px-3 py-1.5 rounded-full
                        text-sm font-medium
                        bg-gray-800/80 text-gray-300
                        border border-gray-700/50
                        hover:bg-gray-700 hover:border-gray-600
                        hover:text-white
                        transition-all duration-200
                        cursor-default
                    "
                >
                    <Tag className="w-3 h-3" />
                    {tag}
                </span>
            ))}
        </div>
    );
}
