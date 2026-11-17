"use client";

import Image from "next/image";
import { useRef, ViewTransition } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ShowcaseBackdrop } from "@/components/effects/showcase-backdrop";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/lib/project-types";
import { cn } from "@/lib/utils";

/**
 * (10) ViewTransition pair with the card thumbnail (cross-page morph).
 * (11) Three phones move at different speeds as the page scrolls.
 */
export function ParallaxShowcase({ project }: { project: Pick<Project, "slug" | "showcase" | "cover"> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const left = useTransform(progress, [0, 1], [70, -70]);
  const right = useTransform(progress, [0, 1], [100, -100]);
  const center = useTransform(progress, [0, 1], [30, -30]);

  const showcase = project.showcase;
  const [leftScreen, centerScreen, rightScreen] = showcase?.screens ?? [];

  return (
    <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
      <div
        ref={ref}
        aria-hidden
        className="relative h-[420px] overflow-hidden rounded-[20px] border border-border bg-surface sm:h-[540px]"
      >
        <ShowcaseBackdrop color={project.cover?.color} colorTo={project.cover?.colorTo} />
        {/* left-1/2 + translate keeps it centered even when wider than the frame (mobile) */}
        <div className="absolute top-[60px] left-1/2 h-full w-[580px] -translate-x-1/2 max-sm:origin-top max-sm:scale-[0.78]">
          <Phone
            y={reduced ? undefined : left}
            screen={leftScreen}
            className="top-[62px] left-0 max-sm:hidden"
          />
          <Phone
            y={reduced ? undefined : right}
            screen={rightScreen}
            className="top-[41px] right-0 max-sm:hidden"
          />
          <Phone y={reduced ? undefined : center} screen={centerScreen} center className="top-0 left-[180px]">
            {!centerScreen && (
              <>
                {showcase?.label && showcase.value && (
                  <>
                    <p className="absolute top-10 left-[18px] text-[11px] text-muted">{showcase.label}</p>
                    <p className="absolute top-[58px] left-[18px] text-2xl font-semibold tracking-tight text-fg">
                      {showcase.value}
                    </p>
                  </>
                )}
                <span className="absolute top-[104px] left-[18px] h-[90px] w-[168px] rounded-[14px] bg-accent" />
                <span className="absolute top-[206px] left-[18px] size-20 rounded-[14px] bg-surface" />
                <span className="absolute top-[206px] left-[106px] size-20 rounded-[14px] bg-surface" />
                <span className="absolute top-[298px] left-[18px] h-[110px] w-[168px] rounded-[14px] bg-surface" />
              </>
            )}
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
  screen,
  y,
}: {
  className?: string;
  children?: React.ReactNode;
  center?: boolean;
  /** Screenshot path; fills the screen when set */
  screen?: string;
  y?: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ y }}
      className={cn(
        "absolute",
        center
          ? "z-10 h-[450px] w-[220px] rounded-[38px] bg-[#3f3f46] p-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)]"
          : "h-[410px] w-[200px] rounded-[34px] bg-[#27272a] p-2 shadow-[0_24px_48px_-20px_rgb(0_0_0/0.4)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-bg",
          center ? "rounded-[30px]" : "rounded-[27px]",
        )}
      >
        {screen ? (
          <Image
            src={screen}
            alt=""
            fill
            sizes={center ? "204px" : "184px"}
            loading={center ? "eager" : undefined}
            className="object-cover object-top"
          />
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
