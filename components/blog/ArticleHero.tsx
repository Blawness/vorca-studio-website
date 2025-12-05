"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ArticleHeroProps {
    title: string;
    excerpt?: string;
    category: string;
    author: string;
    date: string;
    readTime: number;
    image: string;
    language?: "id" | "en";
}

export default function ArticleHero({
    title,
    excerpt,
    category,
    author,
    date,
    readTime,
    image,
    language = "id",
}: ArticleHeroProps) {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-12 pb-10 md:pt-16 md:pb-12 overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#0a1525] to-[#050b16]">
                    {/* Subtle animated orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Breadcrumb Row */}
                        <div className="flex items-center gap-3 mb-6">
                            <Link href="/articles">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-white hover:bg-white/10 -ml-3"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {language === "id" ? "Kembali ke Artikel" : "Back to Articles"}
                                </Button>
                            </Link>
                            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-xs">
                                {category}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
                            {title}
                        </h1>

                        {/* Excerpt/Subheading */}
                        {excerpt && (
                            <p className="text-lg text-gray-400 mb-8 max-w-3xl leading-relaxed">
                                {excerpt}
                            </p>
                        )}

                        {/* Author & Meta Row */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6">
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center ring-2 ring-cyan-500/20">
                                    <User className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{author}</p>
                                    <p className="text-xs text-gray-500">Author</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-8 bg-gray-700" />

                            {/* Date Pill */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-full">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300">{formatDate(date)}</span>
                            </div>

                            {/* Read Time Pill */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-full">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300">
                                    {readTime} {language === "id" ? "menit baca" : "min read"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="relative group"
                >
                    {/* Subtle overlay/glow behind */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                </motion.div>
            </section>
        </>
    );
}
