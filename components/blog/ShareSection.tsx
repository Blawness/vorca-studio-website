"use client";

import { useState } from "react";
import { Link2, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareSectionProps {
    title: string;
    url?: string;
    label?: string;
}

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export default function ShareSection({ title, url, label }: ShareSectionProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const shareToWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const shareToX = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-400 font-medium text-sm">
                {label || "Bagikan:"}
            </span>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="
                        h-9 w-9 p-0
                        border-gray-700 text-gray-300
                        hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400
                        transition-all duration-200
                    "
                    title="Copy link"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <Link2 className="w-4 h-4" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToWhatsApp}
                    className="
                        h-9 w-9 p-0
                        border-gray-700 text-gray-300
                        hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400
                        transition-all duration-200
                    "
                    title="Share to WhatsApp"
                >
                    <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={shareToX}
                    className="
                        h-9 w-9 p-0
                        border-gray-700 text-gray-300
                        hover:bg-gray-500/10 hover:border-gray-500/50 hover:text-white
                        transition-all duration-200
                    "
                    title="Share to X"
                >
                    <XIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
