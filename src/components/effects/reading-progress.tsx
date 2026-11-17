"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** (11) Thin reading progress bar at the top of the page. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
