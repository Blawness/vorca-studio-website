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
import type { Article } from "@/sanity/lib/fetch";

interface ArticlesPageProps {
    articles: Article[];
}

export default function ArticlesPage({ articles }: ArticlesPageProps) {
    const { language } = useLanguage();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Calculate paginated articles (excluding featured article at index 0)
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
        // Scroll to articles section
        document.getElementById("articles-grid")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="pt-16 bg-black min-h-screen">
            <PageHero
                title={language === "id" ? "Artikel & Insight" : "Articles & Insights"}
                subtitle={
                    language === "id"
                        ? "Tips, tutorial, dan insight seputar pengembangan web dan bisnis digital"
                        : "Tips, tutorials, and insights about web development and digital business"
                }
            />

            {/* Categories Filter */}
            <section className="py-8 bg-gradient-to-b from-[#050b16] to-gray-900 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category, index) => (
                            <Button
                                key={index}
                                variant={index === 0 ? "default" : "outline"}
                                size="sm"
                                className={
                                    index === 0
                                        ? "rounded-full px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-[0_8px_24px_-12px_rgba(34,211,238,0.45)] hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                                        : "rounded-full px-5 py-2.5 border border-white/10 text-gray-200/80 bg-white/5 hover:bg-white/10 hover:text-white shadow-inner backdrop-blur-md transition-all duration-300"
                                }
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {articles.length > 0 && (
                <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Link href={`/articles/${articles[0].slug}`}>
                                <Card className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden cursor-pointer">
                                    <div className="grid md:grid-cols-2 gap-0">
                                        <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                                            <img
                                                src={articles[0].image}
                                                alt={articles[0].title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/80 md:block hidden" />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold">
                                                    Featured
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-8 flex flex-col justify-center">
                                            <Badge className="w-fit mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                                {articles[0].category}
                                            </Badge>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
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
                                            <div className="flex items-center text-cyan-400 font-semibold group-hover:gap-3 gap-2 transition-all">
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

            {/* Articles Grid */}
            <section id="articles-grid" className="py-16 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {language === "id" ? "Artikel Terbaru" : "Latest Articles"}
                        </h2>
                        <p className="text-gray-400">
                            {language === "id"
                                ? "Temukan insight dan tips terbaru dari tim kami"
                                : "Discover the latest insights and tips from our team"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/articles/${article.slug}`}>
                                    <Card className="group h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 overflow-hidden cursor-pointer">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                                        </div>
                                        <CardContent className="p-6">
                                            <Badge className="mb-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                                {article.category}
                                            </Badge>
                                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
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
                                                        className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
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
                                className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold"
                                            : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
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
                                className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 via-blue-500/5 to-transparent rounded-full" />
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
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                        >
                            <a href="/contact">
                                {language === "id" ? "Hubungi Kami" : "Contact Us"}
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
