"use client";

import dynamic from "next/dynamic";

/**
 * (8.3) Efek dekoratif dimuat terpisah (lazy) supaya bundle awal ringan.
 * Keduanya murni hiasan, jadi tidak perlu dirender di server.
 */
export const LazyDotGrid = dynamic(
  () => import("@/components/effects/dot-grid").then((m) => m.DotGrid),
  { ssr: false },
);

export const LazyCursorGlow = dynamic(
  () => import("@/components/effects/cursor-glow").then((m) => m.CursorGlow),
  { ssr: false },
);
