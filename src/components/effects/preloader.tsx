"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { profile } from "@/lib/profile";

/**
 * (00) "2 shapes → 1 cursor → 1 name" preloader — only on the first visit per session.
 *
 * 0.0 s   phone & browser icons appear one after another
 * 1.5 s   both are pulled to the center, spin, then melt into a blue block cursor
 * 2.4 s   the cursor types the name (`Althafi Hilal Anshar▌`), then blinks
 * ~5.3 s  name + cursor shrink & glide to the navbar logo while the overlay fades out
 * ~6.6 s  overlay removed
 *
 * The fly/off times are derived from the name length, so a longer or shorter name
 * still gets the same pause (one cursor blink) after typing.
 *
 * All timings live in TIMELINE so the pace can be tuned in one place.
 *
 * The <head> script (PRELOADER_SCRIPT) sets <html data-preloaded> for repeat
 * visits, reduced motion, and touch devices (for phone performance) so the overlay
 * is hidden right away via CSS. On the first visit it sets <html data-preloading> so
 * the navbar logo stays hidden until the preloader's copy "lands".
 */

export const PRELOADER_KEY = "altap:preloaded";

export const PRELOADER_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${PRELOADER_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches||!matchMedia("(hover: hover) and (pointer: fine)").matches){d.dataset.preloaded="1"}else{d.dataset.preloading="1"}}catch(e){d.dataset.preloaded="1"}})()`;

type Phase = "pending" | "icons" | "merge" | "name" | "fly" | "off";

const ease = [0.2, 0.8, 0.2, 1] as const;
const smooth = [0.65, 0, 0.35, 1] as const;

/** Phase start times (ms). */
/** Typing: wait before the first key, then 55–105 ms per key (≈ 80 ms average). */
const TYPE_DELAY = 300;
const TYPE_MIN = 55;
const TYPE_JITTER = 50;
const typeEnd = 2400 + TYPE_DELAY + profile.handle.length * (TYPE_MIN + TYPE_JITTER / 2);
const fly = Math.round(typeEnd + 900);
const TIMELINE = { merge: 1500, name: 2400, fly, off: fly + 1300, safety: fly + 3500 } as const;
const FLY_DURATION = 1.1;

function finish() {
  const root = document.documentElement;
  root.dataset.preloaded = "1";
  delete root.dataset.preloading;
  document.body.style.overflow = "";
}

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("pending");
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${Math.round(v)}%`);
  const barScale = useTransform(progress, (v) => v / 100);
  const markRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    if (root.dataset.preloaded) {
      later(0, () => setPhase("off"));
      return () => timers.forEach(clearTimeout);
    }

    root.dataset.preloading = "1";
    document.body.style.overflow = "hidden";
    const counter = animate(progress, 100, {
      duration: (TIMELINE.fly - 150) / 1000,
      ease: [0.45, 0, 0.25, 1],
    });
    later(0, () => setPhase("icons"));
    later(TIMELINE.merge, () => setPhase("merge"));
    later(TIMELINE.name, () => setPhase("name"));
    later(TIMELINE.fly, () => {
      try {
        sessionStorage.setItem(PRELOADER_KEY, "1");
      } catch {}
      // The page starts entering (hero title etc.) while the logo flies
      root.dataset.preloaded = "1";
      setPhase("fly");
    });
    later(TIMELINE.off, () => {
      finish();
      setPhase("off");
    });
    // Safety net: whatever happens, the overlay disappears eventually
    later(TIMELINE.safety, () => {
      finish();
      setPhase("off");
    });

    return () => {
      counter.stop();
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [progress]);

  // Fly to the navbar logo: measure the target position, then animate x/y/scale
  useEffect(() => {
    if (phase !== "fly") return;
    const pairs: [HTMLElement | null, Element | null][] = [
      [markRef.current, document.querySelector("[data-logo-mark]")],
      [textRef.current, document.querySelector("[data-logo-text]")],
    ];
    const animations = pairs.flatMap(([from, to]) => {
      if (!from || !to) return [];
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      from.style.transformOrigin = "0 0";
      return [
        animate(
          from,
          { x: b.left - a.left, y: b.top - a.top, scale: b.height / a.height },
          { duration: FLY_DURATION, ease: smooth },
        ),
      ];
    });
    return () => animations.forEach((a) => a.stop());
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "off" && (
        <div
          key="preloader"
          aria-hidden
          className="preloader pointer-events-none fixed inset-0 z-[100] [view-transition-name:preloader]"
        >
          <motion.div
            className="pointer-events-auto absolute inset-0 bg-bg"
            animate={{ opacity: phase === "fly" ? 0 : 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: smooth }}
          />
          {phase !== "pending" && (
            <>
              <div className="absolute inset-0 grid place-items-center">
                {phase === "icons" || phase === "merge" ? (
                  <Shapes merging={phase === "merge"} />
                ) : (
                  <TypedName
                    text={profile.handle}
                    textRef={textRef}
                    markRef={markRef}
                    blink={phase === "name"}
                  />
                )}
              </div>

              <motion.div
                animate={{ opacity: phase === "fly" ? 0 : 1 }}
                transition={{ duration: 0.5, ease: smooth }}
              >
                <div className="absolute inset-x-7 bottom-6 flex items-center justify-between font-mono text-xs">
                  <span className="text-muted">Loading portfolio…</span>
                  <motion.span className="font-medium text-fg">{percent}</motion.span>
                </div>
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
                  style={{ scaleX: barScale }}
                />
              </motion.div>
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

/** Phone and browser icons (representing the 2 project categories). */
function Shapes({ merging }: { merging: boolean }) {
  const items = [
    {
      label: "mobile",
      x: -56,
      shape: <span className="block h-[52px] w-[30px] rounded-lg border-2 border-fg" />,
    },
    {
      label: "web",
      x: 56,
      shape: (
        <span className="block h-[42px] w-14 rounded-[7px] border-2 border-fg">
          <span className="mt-2 block h-0.5 bg-fg" />
        </span>
      ),
    },
  ];

  return (
    <div className="relative h-24 w-[260px]">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="absolute top-0 left-1/2 -ml-8 flex w-16 flex-col items-center gap-3"
          initial={{ opacity: 0, y: 14, x: item.x, scale: 0.8 }}
          animate={
            merging
              ? { opacity: 0, x: 0, y: 4, scale: 0.35, rotate: 90 }
              : { opacity: 1, x: item.x, y: 0, scale: 1, rotate: 0 }
          }
          transition={
            merging
              ? { duration: 0.8, ease }
              : { delay: 0.15 + i * 0.25, type: "spring", stiffness: 170, damping: 20 }
          }
        >
          <span className="grid h-[52px] place-items-center">{item.shape}</span>
          <span className="font-mono text-[11px] text-muted">{item.label}</span>
        </motion.div>
      ))}
      {merging && (
        // Same size & spot as the cursor in <TypedName>, so the hand-off is seamless
        <motion.span
          className="absolute top-4 left-1/2 -ml-4 block h-16 w-8 rounded-[6px] bg-accent"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 20 }}
        />
      )}
    </div>
  );
}

/**
 * The cursor types the name. The text box grows to each typed prefix (measured from a
 * hidden copy) with a short tween, so the cursor glides right instead of jumping.
 * Cursor is 32×64 → lands as the navbar's 9×18 cursor (scale 18/64).
 */
function TypedName({
  text,
  textRef,
  markRef,
  blink,
}: {
  text: string;
  textRef: React.Ref<HTMLSpanElement>;
  markRef: React.Ref<HTMLSpanElement>;
  blink: boolean;
}) {
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let typed = 0;
    let id = 0;
    const tick = () => {
      typed++;
      const measure = measureRef.current;
      if (measure) {
        const left = measure.getBoundingClientRect().left;
        const char = measure.children[typed - 1];
        const right =
          typed >= text.length
            ? measure.getBoundingClientRect().right
            : char.getBoundingClientRect().right;
        setWidth(Math.ceil(right - left));
      }
      setCount(typed);
      if (typed < text.length) id = window.setTimeout(tick, TYPE_MIN + Math.random() * TYPE_JITTER);
    };
    id = window.setTimeout(tick, TYPE_DELAY);
    return () => window.clearTimeout(id);
  }, [text]);

  const done = count >= text.length;

  return (
    <div className="flex items-center">
      <motion.span
        ref={textRef}
        className="relative block overflow-x-clip text-[64px] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap text-fg"
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        <span ref={measureRef} aria-hidden className="invisible absolute top-0 left-0">
          {text.split("").map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </span>
        {text.slice(0, count)}
      </motion.span>
      <motion.span
        className="block"
        initial={{ width: 0 }}
        animate={{ width: count ? 10 : 0 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      />
      {/* Solid while typing (like a real terminal), blinks once the name is done */}
      <span
        ref={markRef}
        className={`block h-16 w-8 shrink-0 rounded-[6px] bg-accent ${done && blink ? "caret" : ""}`}
      />
    </div>
  );
}
