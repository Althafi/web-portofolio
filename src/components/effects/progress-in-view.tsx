"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/** (12) Progress bar that fills 0 → value when it comes into view. */
export function ProgressInView({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = usePrefersReducedMotion();
  const show = inView || reduced;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="mt-3.5 h-1.5 overflow-hidden rounded-[3px] bg-border"
    >
      <motion.div
        className="h-full rounded-[3px] bg-accent"
        initial={false}
        animate={{ width: show ? `${value}%` : "0%" }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
      />
    </div>
  );
}
