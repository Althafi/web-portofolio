"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRichMotion } from "@/hooks/use-reduced-motion";

/**
 * (14) Blue glow that follows the cursor inside its parent element.
 * Without interaction, the glow rests at the top right (its position in the design).
 */
export function CursorGlow() {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useRichMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const rest = () => {
      x.set(host.clientWidth - 300);
      y.set(80);
    };
    rest();
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", rest);
    window.addEventListener("resize", rest);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", rest);
      window.removeEventListener("resize", rest);
    };
  }, [enabled, x, y]);

  return (
    <motion.span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_45%,transparent),transparent)]"
      style={{ x: sx, y: sy }}
    />
  );
}
