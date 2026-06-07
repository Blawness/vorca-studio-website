"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Code-split, client-only — loaded after first paint so they don't add to the
// initial JS/hydration cost (helps TBT/LCP). None of these are needed for
// first render: smooth scroll, custom cursor, and grain are pure polish.
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const GrainOverlay = dynamic(() => import("./GrainOverlay"), { ssr: false });

export default function DeferredEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = schedule(() => setReady(true));
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <GrainOverlay />
    </>
  );
}
