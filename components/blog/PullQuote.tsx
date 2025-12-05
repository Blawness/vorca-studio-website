"use client";

import { ReactNode } from "react";

interface PullQuoteProps {
    children: ReactNode;
}

export default function PullQuote({ children }: PullQuoteProps) {
    return (
        <blockquote
            className="
                my-10 py-6 px-8
                border-l-4 border-cyan-500
                bg-gradient-to-r from-cyan-950/30 to-transparent
                rounded-r-xl
            "
        >
            <p className="text-xl md:text-2xl font-medium text-gray-100 italic leading-relaxed">
                {children}
            </p>
        </blockquote>
    );
}
