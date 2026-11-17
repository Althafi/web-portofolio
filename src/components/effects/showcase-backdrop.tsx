"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useRichMotion } from "@/hooks/use-reduced-motion";

/**
 * Layered background for the detail-page showcase card, tinted with the app's
 * brand color (falls back to the site accent):
 *  1. two blurred color orbs drifting slowly (CSS, off for reduced motion)
 *  2. a dot grid that fades out toward the edges
 *  3. concentric rings behind the center phone
 *  4. a spotlight that follows the cursor (fine pointers only)
 *  5. a soft vignette so the phones stay the focus
 */
export function ShowcaseBackdrop({ color, colorTo }: { color?: string; colorTo?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.5 });
  const show = useMotionValue(0);
  const opacity = useSpring(show, { stiffness: 120, damping: 24 });
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, color-mix(in oklab, var(--brand) 38%, transparent), transparent 70%)`;

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || !rich) return;
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
      show.set(1);
    };
    const onLeave = () => show.set(0);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [rich, x, y, show]);

  const brand = color ?? "var(--accent)";
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--brand": brand, "--brand-2": colorTo ?? brand } as React.CSSProperties}
    >
      {/* base tint */}
      <span className="absolute inset-0 bg-[color-mix(in_oklab,var(--brand)_6%,transparent)]" />

      {/* drifting orbs */}
      <span className="orb-a absolute -top-[22%] left-[8%] size-[62%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_42%,transparent),transparent)] blur-2xl" />
      <span className="orb-b absolute -right-[6%] bottom-[-26%] size-[58%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-2)_36%,transparent),transparent)] blur-2xl" />

      {/* dot grid, fading out from the center */}
      <span className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--fg)_22%,transparent)_1px,transparent_1.4px)] [mask-image:radial-gradient(ellipse_70%_75%_at_50%_45%,#000,transparent_80%)] bg-[length:24px_24px]" />

      {/* rings behind the center phone */}
      <span className="absolute top-[48%] left-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_oklab,var(--brand)_26%,transparent)] [mask-image:radial-gradient(closest-side,#000_55%,transparent)]" />
      <span className="absolute top-[48%] left-1/2 aspect-square w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_oklab,var(--brand)_20%,transparent)] [mask-image:radial-gradient(closest-side,#000_55%,transparent)]" />

      {/* cursor spotlight */}
      {rich && (
        <motion.span
          className="absolute inset-0"
          style={{ background: spotlight, opacity }}
        />
      )}

      {/* vignette */}
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_oklab,var(--bg)_55%,transparent))]" />
    </div>
  );
}
