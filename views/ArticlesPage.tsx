"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHero } from "@/components/PageHero";
import Link from "next/link";
import type { Article } from "@/lib/articles";

interface ArticlesPageProps {
    articles: Article[];
}

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">
            {children}
        </span>
    );
}

export default function ArticlesPage({ articles }: ArticlesPageProps) {
    const { language } = useLanguage();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const remainingArticles = articles.slice(1);
    const totalPages = Math.ceil(remainingArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedArticles = remainingArticles.slice(startIndex, startIndex + itemsPerPage);

    const categories = ["Semua", "Web Development", "UI/UX Design", "Business", "Backend"];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById("articles-grid")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="pt-16 bg-[#050b16] min-h-screen">
            <PageHero
                eyebrow={language === "id" ? "BLOG VORCA" : "VORCA BLOG"}
                title={language === "id" ? "Artikel & Insight" : "Articles & Insights"}
                subtitle={
                    language === "id"
                        ? "Tips, tutorial, dan insight seputar pengembangan web dan bisnis digital"
                        : "Tips, tutorials, and insights about web development and digital business"
                }
            />

            {/* Categories Filter */}
            <section className="py-8 bg-[#050b16] border-b border-white/[0.06] relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-4">
                        <SectionLabel>
                            {language === "id" ? "Kategori" : "Categories"}
                        </SectionLabel>
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category, index) => (
                                <Button
                                    key={index}
                                    variant={index === 0 ? "default" : "outline"}
                                    size="sm"
                                    className={
                                        index === 0
                                            ? "rounded-full px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 border-0"
                                            : "rounded-full px-5 py-2.5 bg-white/[0.02] border border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-white hover:border-blue-500/20 transition-all duration-300"
                                    }
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Article */}
            {articles.length > 0 && (
                <section className="py-16 bg-[#050b16] relative">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
                            <SectionLabel>
                                {language === "id" ? "Artikel Pilihan" : "Featured Article"}
                            </SectionLabel>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Link href={`/articles/${articles[0].slug}`}>
                                <Card className="group bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg shadow-blue-600/20">
                                    <div className="grid md:grid-cols-2 gap-0">
                                        <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                                            <img
                                                src={articles[0].image}
                                                alt={articles[0].title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050b16]/80 md:block hidden" />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-blue-600/15 text-blue-400 border border-blue-500/10 font-semibold">
                                                    Featured
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-8 flex flex-col justify-center">
                                            <Badge className="w-fit mb-4 bg-blue-600/10 text-blue-400 border border-blue-500/20">
                                                {articles[0].category}
                                            </Badge>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                                {articles[0].title}
                                            </h2>
                                            <p className="text-gray-400 mb-6 line-clamp-3">
                                                {articles[0].excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-4 h-4" />
                                                    <span>{articles[0].author}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(articles[0].date)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {articles[0].readTime} {language === "id" ? "menit" : "min"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-blue-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                                                {language === "id" ? "Baca Selengkapnya" : "Read More"}
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Section Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* Articles Grid */}
            <section id="articles-grid" className="py-16 bg-[#050b16] relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
                        <SectionLabel>
                            {language === "id" ? "Artikel Terbaru" : "Latest Articles"}
                        </SectionLabel>
                        <h2 className="text-3xl font-bold text-white mt-2 mb-2">
                            {language === "id"
                                ? "Temukan insight dan tips terbaru dari tim kami"
                                : "Discover the latest insights and tips from our team"}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/articles/${article.slug}`}>
                                    <Card className="group h-full bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg shadow-blue-600/20">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050b16] via-transparent to-transparent" />
                                        </div>
                                        <CardContent className="p-6">
                                            <Badge className="mb-3 bg-blue-600/10 text-blue-400 border border-blue-500/20">
                                                {article.category}
                                            </Badge>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-400 mb-4 line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    <span>{article.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>
                                                        {article.readTime} {language === "id" ? "menit" : "min"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {article.tags.slice(0, 3).map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className="text-xs bg-white/[0.04] text-gray-300 border-white/[0.06]"
                                                    >
                                                        <Tag className="w-3 h-3 mr-1" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                    className={
                                        currentPage === page
                                            ? "bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 border-0"
                                            : "border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-white"
                                    }
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Section Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* Newsletter CTA */}
            <section className="py-20 bg-[#050b16] relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            {language === "id"
                                ? "Siap Membangun Website Profesional?"
                                : "Ready to Build a Professional Website?"}
                        </h2>
                        <p className="text-xl text-gray-400 mb-8">
                            {language === "id"
                                ? "Diskusikan kebutuhan website Anda dengan tim kami. Konsultasi gratis!"
                                : "Discuss your website needs with our team. Free consultation!"}
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="h-auto rounded-xl px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 border-0 gap-2"
                        >
                            <a href="/contact">
                                {language === "id" ? "Hubungi Kami" : "Contact Us"}
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
