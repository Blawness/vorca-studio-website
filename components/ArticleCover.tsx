"use client";

import { useState } from "react";
import VorcaMark from "@/components/VorcaMark";

/** A few on-brand accents so blank covers aren't all identical. */
const ACCENTS = [
  { glow: "rgba(37,99,235,0.20)", chip: "bg-blue-600/15 border-blue-500/25", mark: "text-blue-300" },
  { glow: "rgba(6,182,212,0.18)", chip: "bg-cyan-600/15 border-cyan-500/25", mark: "text-cyan-300" },
  { glow: "rgba(99,102,241,0.18)", chip: "bg-indigo-600/15 border-indigo-500/25", mark: "text-indigo-300" },
];

function accentFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

/**
 * Article cover image with a code-rendered Vorca-brand placeholder fallback.
 * Shows the placeholder when there's no usable image, or if the image fails
 * to load. No external/placeholder image files involved.
 */
export default function ArticleCover({
  src,
  alt,
  seed,
  className = "",
}: {
  src?: string | null;
  alt: string;
  seed?: string;
  className?: string;
}) {
  const usable = !!src && src.trim() !== "" && !src.endsWith("/icon-512x512.png");
  const [failed, setFailed] = useState(false);
  const showImage = usable && !failed;
  const accent = accentFor(seed || alt || "vorca");

  if (showImage) {
    return (
      <img
        src={src as string}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0a1f3a] to-[#050b16] flex items-center justify-center ${className}`}>
      {/* Brand glow */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${accent.glow} 0%, transparent 70%)` }}
      />
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
      {/* Oversized watermark mark */}
      <VorcaMark className="absolute -right-8 -bottom-10 w-44 h-44 text-white/[0.04] transition-transform duration-500 group-hover:scale-110" />
      {/* Centered brand lockup */}
      <div className="relative flex flex-col items-center gap-2.5">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${accent.chip}`}>
          <VorcaMark className={`h-8 w-8 ${accent.mark}`} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
          Vorca Studio
        </span>
      </div>
    </div>
  );
}
