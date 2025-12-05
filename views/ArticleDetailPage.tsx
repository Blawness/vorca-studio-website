"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import articlesData from "@/app/data/articles.json";
import { notFound } from "next/navigation";

interface ArticleDetailPageProps {
    slug: string;
}

interface Article {
    id: string;
    slug: string;
    title: string;
    titleEn: string;
    excerpt: string;
    excerptEn: string;
    content: string;
    contentEn: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: number;
    tags: string[];
}

export default function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
    const { language } = useLanguage();
    const articles: Article[] = articlesData;
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Get related articles (same category, excluding current)
    const relatedArticles = articles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 3);

    const content = language === "id" ? article.content : article.contentEn;

    return (
        <div className="pt-16 bg-black min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-[#050b16]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#050b16] via-gray-900 to-[#050b16] opacity-90" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Back Button */}
                        <Link href="/articles">
                            <Button
                                variant="ghost"
                                className="mb-8 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {language === "id" ? "Kembali ke Artikel" : "Back to Articles"}
                            </Button>
                        </Link>

                        {/* Category */}
                        <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold">
                            {article.category}
                        </Badge>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {language === "id" ? article.title : article.titleEn}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <User className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{article.author}</p>
                                    <p className="text-sm text-gray-500">Author</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{formatDate(article.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>
                                    {article.readTime} {language === "id" ? "menit baca" : "min read"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
                >
                    <img
                        src={article.image}
                        alt={language === "id" ? article.title : article.titleEn}
                        className="w-full h-64 md:h-96 object-cover"
                    />
                </motion.div>
            </section>

            {/* Content */}
            <section className="py-16 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {/* Article Content */}
                        <div className="prose prose-lg prose-invert max-w-none">
                            {content.split("\n\n").map((paragraph, index) => {
                                // Helper function to parse inline formatting (bold, italic, links)
                                const parseInlineFormatting = (text: string) => {
                                    // Split by bold (**), italic (*), and links ([text](url))
                                    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/);
                                    return parts.map((part, j) => {
                                        // Bold text
                                        if (part.startsWith("**") && part.endsWith("**")) {
                                            return (
                                                <strong key={j} className="text-cyan-400 font-semibold">
                                                    {part.slice(2, -2)}
                                                </strong>
                                            );
                                        }
                                        // Italic text
                                        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
                                            return (
                                                <em key={j} className="text-gray-200 italic">
                                                    {part.slice(1, -1)}
                                                </em>
                                            );
                                        }
                                        // Links [text](url)
                                        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                                        if (linkMatch) {
                                            const [, linkText, linkUrl] = linkMatch;
                                            return (
                                                <Link
                                                    key={j}
                                                    href={linkUrl}
                                                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors font-medium"
                                                >
                                                    {linkText}
                                                </Link>
                                            );
                                        }
                                        return <span key={j}>{part}</span>;
                                    });
                                };

                                // Check if it's a heading
                                if (paragraph.startsWith("## ")) {
                                    return (
                                        <h2
                                            key={index}
                                            className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 pb-2 border-b border-cyan-500/30"
                                        >
                                            {paragraph.replace("## ", "")}
                                        </h2>
                                    );
                                }
                                if (paragraph.startsWith("### ")) {
                                    return (
                                        <h3
                                            key={index}
                                            className="text-xl md:text-2xl font-bold text-white mt-10 mb-4"
                                        >
                                            {paragraph.replace("### ", "")}
                                        </h3>
                                    );
                                }
                                // Check if it's a list
                                if (paragraph.startsWith("- ")) {
                                    const items = paragraph.split("\n");
                                    return (
                                        <ul key={index} className="list-none space-y-3 my-6 pl-2">
                                            {items.map((item, i) => (
                                                <li key={i} className="flex items-start text-gray-300 leading-relaxed">
                                                    <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-2.5 mr-4 flex-shrink-0" />
                                                    <span>{parseInlineFormatting(item.replace("- ", ""))}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                // Check if it's a numbered list
                                if (/^\d+\./.test(paragraph)) {
                                    const items = paragraph.split("\n");
                                    return (
                                        <ol key={index} className="list-none space-y-4 my-6">
                                            {items.map((item, i) => {
                                                const content = item.replace(/^\d+\.\s*/, "");
                                                return (
                                                    <li key={i} className="flex items-start text-gray-300 leading-relaxed">
                                                        <span className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-black text-sm font-bold mr-4 flex-shrink-0 mt-0.5">
                                                            {i + 1}
                                                        </span>
                                                        <span className="flex-1">{parseInlineFormatting(content)}</span>
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    );
                                }
                                // Regular paragraph
                                return (
                                    <p key={index} className="text-gray-300 leading-relaxed text-lg mb-6">
                                        {parseInlineFormatting(paragraph)}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-gray-800">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-gray-400 font-medium">Tags:</span>
                                {article.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                                    >
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-8 flex items-center gap-4">
                            <span className="text-gray-400 font-medium">
                                {language === "id" ? "Bagikan:" : "Share:"}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: language === "id" ? article.title : article.titleEn,
                                            url: window.location.href,
                                        });
                                    }
                                }}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                {language === "id" ? "Bagikan" : "Share"}
                            </Button>
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
                                        <div className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300">
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={related.image}
                                                    alt={language === "id" ? related.title : related.titleEn}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-white font-semibold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                                    {language === "id" ? related.title : related.titleEn}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    {related.readTime} {language === "id" ? "menit" : "min"}
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

            {/* CTA */}
            <section className="py-16 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {language === "id"
                            ? "Butuh bantuan untuk proyek Anda?"
                            : "Need help with your project?"}
                    </h2>
                    <p className="text-gray-400 mb-8">
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
                </div>
            </section>
        </div>
    );
}
