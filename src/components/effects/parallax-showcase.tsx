"use client";

import { useRef, ViewTransition } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/lib/project-types";
import { cn } from "@/lib/utils";

/**
 * (10) Pasangan ViewTransition dengan thumbnail kartu (morph antarhalaman).
 * (11) Tiga HP bergerak dengan kecepatan berbeda saat halaman digulir.
 */
export function ParallaxShowcase({ project }: { project: Pick<Project, "slug" | "showcase"> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const left = useTransform(progress, [0, 1], [70, -70]);
  const right = useTransform(progress, [0, 1], [100, -100]);
  const center = useTransform(progress, [0, 1], [30, -30]);

  return (
    <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
      <div
        ref={ref}
        aria-hidden
        className="relative h-[420px] overflow-hidden rounded-[20px] border border-border bg-surface sm:h-[540px]"
      >
        <span className="absolute -top-[260px] left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_30%,transparent),transparent)]" />
        <div className="absolute inset-x-0 top-[60px] mx-auto h-full w-[580px] max-sm:origin-top max-sm:scale-[0.78]">
          <Phone y={reduced ? undefined : left} className="top-[62px] left-0 max-sm:hidden" />
          <Phone y={reduced ? undefined : right} className="top-[41px] right-0 max-sm:hidden" />
          <Phone y={reduced ? undefined : center} center className="top-0 left-[180px]">
            {project.showcase && (
              <>
                <p className="absolute top-10 left-[18px] text-[11px] text-muted">
                  {project.showcase.label}
                </p>
                <p className="absolute top-[58px] left-[18px] text-2xl font-semibold tracking-tight text-fg">
                  {project.showcase.value}
                </p>
              </>
            )}
            <span className="absolute top-[104px] left-[18px] h-[90px] w-[168px] rounded-[14px] bg-accent" />
            <span className="absolute top-[206px] left-[18px] size-20 rounded-[14px] bg-surface" />
            <span className="absolute top-[206px] left-[106px] size-20 rounded-[14px] bg-surface" />
            <span className="absolute top-[298px] left-[18px] h-[110px] w-[168px] rounded-[14px] bg-surface" />
          </Phone>
        </div>
      </div>
    </ViewTransition>
  );
}

function Phone({
  className,
  children,
  center = false,
  y,
}: {
  className?: string;
  children?: React.ReactNode;
  center?: boolean;
  y?: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ y }}
      className={cn(
        "absolute",
        center
          ? "z-10 h-[450px] w-[220px] rounded-[38px] bg-[#3f3f46] p-2"
          : "h-[410px] w-[200px] rounded-[34px] bg-[#27272a] p-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-bg",
          center ? "rounded-[30px]" : "rounded-[27px]",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}
