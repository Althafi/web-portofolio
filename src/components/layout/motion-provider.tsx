"use client";

import { MotionConfig } from "motion/react";

/** All Motion animations respect the user's prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
