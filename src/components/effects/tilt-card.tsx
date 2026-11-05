"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRichMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** (03) Tilt 3D mengikuti kursor + kilau (sheen). Mati di layar sentuh/reduced motion. */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useRichMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), spring);
  const sheenOpacity = useSpring(0, { stiffness: 200, damping: 30 });
  const sheenX = useTransform(px, (v) => `${v * 100}%`);
  const sheenY = useTransform(py, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgb(255 255 255 / 0.35), transparent 55%)`;

  function onMove(e: React.PointerEvent) {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = ref.current!.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    sheenOpacity.set(1);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    sheenOpacity.set(0);
  }

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={enabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative"
      >
        {children}
        {enabled && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] mix-blend-soft-light"
            style={{ backgroundImage: sheen, opacity: sheenOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
}
