"use client";

import { MotionConfig } from "motion/react";

/** Semua animasi Motion mengikuti prefers-reduced-motion pengguna. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
