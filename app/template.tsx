"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation, giving a subtle fade-up transition between
 * pages without a heavy router-transition library.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
