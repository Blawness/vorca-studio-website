"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article } from "@/sanity/lib/fetch";

// Import blog components
import {
    ArticleHero,
    ArticleBody,
    ArticleTOC,
    TagList,
    ShareSection,
    extractHeadings,
} from "@/components/blog";

interface ArticleDetailPageProps {
    article: Article | null;
    relatedArticles: Article[];
}

export default function ArticleDetailPage({ article, relatedArticles }: ArticleDetailPageProps) {
    const { language } = useLanguage();

    if (!article) {
        notFound();
    }

    // Article content (Indonesian only)
    const content = article.content;
    const title = article.title;
    const excerpt = article.excerpt;

    // Extract headings for TOC
    const headings = useMemo(() => extractHeadings(content || ""), [content]);

    return (
        <div className="pt-16 bg-black min-h-screen">
            {/* Hero Section */}
            <ArticleHero
                title={title}
                excerpt={excerpt}
                category={article.category}
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                image={article.image}
                language={language}
            />

            {/* Content Area with TOC */}
            <section className="py-12 bg-gradient-to-b from-[#050b16] via-gray-900/50 to-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Mobile TOC - Shows above content */}
                        <div className="lg:hidden mb-8">
                            <ArticleTOC headings={headings} language={language} />
                        </div>

                        {/* Content + Desktop TOC Layout */}
                        <div className="flex gap-10">
                            {/* Main Content */}
                            <article className="flex-1 max-w-3xl">
                                <ArticleBody content={content || ""} language={language} />

                                {/* Divider */}
                                <div className="mt-14 pt-8 border-t border-gray-800">
                                    {/* Tags */}
                                    <TagList
                                        tags={article.tags}
                                        label={language === "id" ? "Tags:" : "Tags:"}
                                    />

                                    {/* Share */}
                                    <div className="mt-6">
                                        <ShareSection
                                            title={title}
                                            label={language === "id" ? "Bagikan:" : "Share:"}
                                        />
                                    </div>
                                </div>
                            </article>

                            {/* Desktop TOC Sidebar */}
                            <div className="hidden lg:block">
                                <ArticleTOC headings={headings} language={language} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-white mb-8">
                            {language === "id" ? "Artikel Terkait" : "Related Articles"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related, index) => (
                                <motion.div
                                    key={related.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link href={`/articles/${related.slug}`}>
                                        <div className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/30 hover:bg-gray-800 transition-all duration-300">
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={related.image}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-white font-semibold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                                    {related.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    {related.readTime} {language === "id" ? "menit baca" : "min read"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            {language === "id"
                                ? "Butuh bantuan untuk proyek Anda?"
                                : "Need help with your project?"}
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            {language === "id"
                                ? "Konsultasikan kebutuhan website atau aplikasi Anda dengan tim kami."
                                : "Consult your website or application needs with our team."}
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
