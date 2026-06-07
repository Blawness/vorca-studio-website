"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Desktop-only custom cursor: a precise dot plus a lagging ring that expands
 * over interactive elements. Hidden entirely on touch / coarse pointers and
 * when reduced-motion is requested. Uses mix-blend-difference so it stays
 * visible over any background.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.style.cursor = "none";

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHovering(
        !!el?.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')
      );
    };
    const downH = () => setDown(true);
    const upH = () => setDown(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", downH);
    window.addEventListener("mouseup", upH);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", downH);
      window.removeEventListener("mouseup", upH);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference" aria-hidden>
      {/* Dot */}
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
      {/* Ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <motion.div
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            opacity: down ? 0.4 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        />
      </motion.div>
    </div>
  );
}
