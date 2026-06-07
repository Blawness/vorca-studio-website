"use client";

import { ReactNode } from "react";

interface PageHeroProps {
    title: ReactNode;
    subtitle?: ReactNode;
    /** Short uppercase label shown above the title. */
    eyebrow?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export function PageHero({ title, subtitle, eyebrow, children, className = "" }: PageHeroProps) {
    return (
        <section className={`relative pt-28 pb-14 overflow-hidden border-b border-white/[0.06] ${className}`}>
            {/* Background: layered glow + grid texture (no floaty blobs) */}
            <div className="absolute inset-0 bg-[#050b16]">
                {/* Contained top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.16)_0%,rgba(6,182,212,0.05)_40%,transparent_70%)]" />
                {/* Grid overlay for depth, faded toward edges */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="animate-fadeInUp">
                    {eyebrow && (
                        <div className="mb-4 flex justify-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                {eyebrow}
                            </span>
                        </div>
                    )}

                    <div className="mb-5">
                        {typeof title === "string" ? (
                            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent pb-1">
                                {title}
                            </h1>
                        ) : (
                            title
                        )}
                    </div>

                    {subtitle && (
                        <div className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            {subtitle}
                        </div>
                    )}

                    {children && <div className="mt-8">{children}</div>}
                </div>
            </div>
        </section>
    );
}
