import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
    title: ReactNode;
    subtitle?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export function PageHero({ title, subtitle, children, className = "" }: PageHeroProps) {
    return (
        <section className={`relative pt-32 pb-20 overflow-hidden ${className}`}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[#050b16]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#050b16] via-gray-900 to-[#050b16] opacity-90"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-6">
                        {typeof title === "string" ? (
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent pb-3">
                                {title}
                            </h1>
                        ) : (
                            title
                        )}
                    </div>

                    {subtitle && (
                        <div className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                            {subtitle}
                        </div>
                    )}

                    {children}
                </motion.div>
            </div>

            {/* Bottom Fade Out */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050b16] pointer-events-none z-20"></div>
        </section>
    );
}
