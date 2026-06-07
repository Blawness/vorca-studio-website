"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

/**
 * Animates a numeric stat from 0 to its target when scrolled into view.
 * Accepts display strings like "50+", "100%", "4.9" — it parses the leading
 * number, preserves decimals, and re-appends any suffix.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const numStr = match ? match[1] : "0";
  const target = parseFloat(numStr) || 0;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const suffix = match ? match[2] : value;

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, target, decimals, suffix, mv]);

  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals) + suffix}
    </span>
  );
}
