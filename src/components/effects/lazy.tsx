"use client";

import dynamic from "next/dynamic";

/**
 * (8.3) Decorative effects are loaded separately (lazy) to keep the initial bundle light.
 * Both are purely decorative, so they don't need server rendering.
 */
export const LazyDotGrid = dynamic(
  () => import("@/components/effects/dot-grid").then((m) => m.DotGrid),
  { ssr: false },
);

export const LazyCursorGlow = dynamic(
  () => import("@/components/effects/cursor-glow").then((m) => m.CursorGlow),
  { ssr: false },
);
