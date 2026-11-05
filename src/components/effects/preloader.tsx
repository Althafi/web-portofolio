"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { profile } from "@/lib/profile";

/**
 * (00) Preloader "3 bentuk → 1 nama" — hanya saat kunjungan pertama per sesi.
 *
 * 0,0 dtk  ikon HP, browser & terminal muncul bergantian
 * 0,45 dtk ketiganya tertarik ke tengah, berputar, lalu meleleh jadi blob biru
 * 0,85 dtk nama ter-decode dari karakter acak
 * 1,4 dtk  blob + nama mengecil & terbang ke posisi logo navbar, halaman masuk
 *
 * Skrip di <head> (PRELOADER_SCRIPT) menandai <html data-preloaded> untuk
 * kunjungan berikutnya, reduced motion, dan perangkat sentuh (demi performa HP) sehingga overlay langsung disembunyikan
 * lewat CSS. Pada kunjungan pertama ia menandai <html data-preloading> supaya
 * logo navbar disembunyikan sampai salinan dari preloader "mendarat".
 */

export const PRELOADER_KEY = "altap:preloaded";

export const PRELOADER_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${PRELOADER_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches||!matchMedia("(hover: hover) and (pointer: fine)").matches){d.dataset.preloaded="1"}else{d.dataset.preloading="1"}}catch(e){d.dataset.preloaded="1"}})()`;

type Phase = "pending" | "icons" | "merge" | "name" | "fly" | "off";

const ease = [0.2, 0.8, 0.2, 1] as const;

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
    const counter = animate(progress, 100, { duration: 1.35, ease: [0.4, 0, 0.2, 1] });
    later(0, () => setPhase("icons"));
    later(450, () => setPhase("merge"));
    later(850, () => setPhase("name"));
    later(1400, () => {
      try {
        sessionStorage.setItem(PRELOADER_KEY, "1");
      } catch {}
      // Halaman mulai masuk (judul hero dsb.) bersamaan dengan logo terbang
      root.dataset.preloaded = "1";
      setPhase("fly");
    });
    later(2050, () => {
      finish();
      setPhase("off");
    });
    // Pengaman: apa pun yang terjadi, overlay hilang setelah 4 detik
    later(4000, () => {
      finish();
      setPhase("off");
    });

    return () => {
      counter.stop();
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [progress]);

  // Terbang ke logo navbar: ukur posisi tujuan lalu animasikan x/y/scale
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
          { duration: 0.6, ease: [0.65, 0, 0.25, 1] },
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
            transition={{ duration: 0.45, delay: 0.1 }}
          />
          {phase !== "pending" && (
            <>
              <div className="absolute inset-0 grid place-items-center">
                {phase === "icons" || phase === "merge" ? (
                  <Shapes merging={phase === "merge"} />
                ) : (
                  <div className="flex items-center gap-4">
                    <motion.span
                      ref={markRef}
                      className="block size-[60px] rounded-[6px_33px_33px_33px] bg-accent"
                    />
                    <span
                      ref={textRef}
                      className="block text-[64px] leading-none font-semibold tracking-[-0.04em] text-fg"
                    >
                      <Scramble text={profile.handle} />
                    </span>
                  </div>
                )}
              </div>

              <motion.div
                animate={{ opacity: phase === "fly" ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-x-7 bottom-6 flex items-center justify-between font-mono text-xs">
                  <span className="text-muted">Memuat portofolio…</span>
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

/** Ikon HP, browser, dan terminal (mewakili 3 kategori proyek). */
function Shapes({ merging }: { merging: boolean }) {
  const items = [
    {
      label: "mobile",
      x: -96,
      shape: <span className="block h-[52px] w-[30px] rounded-lg border-2 border-fg" />,
    },
    {
      label: "web",
      x: 0,
      shape: (
        <span className="block h-[42px] w-14 rounded-[7px] border-2 border-fg">
          <span className="mt-2 block h-0.5 bg-fg" />
        </span>
      ),
    },
    {
      label: "tools",
      x: 96,
      shape: (
        <span className="grid h-[42px] w-14 place-items-center rounded-[7px] bg-fg font-mono text-base font-bold text-accent">
          &gt;_
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
              ? { duration: 0.38, ease }
              : { delay: i * 0.09, type: "spring", stiffness: 380, damping: 22 }
          }
        >
          <span className="grid h-[52px] place-items-center">{item.shape}</span>
          <span className="font-mono text-[11px] text-muted">{item.label}</span>
        </motion.div>
      ))}
      {merging && (
        <motion.span
          className="absolute top-[18px] left-1/2 -ml-[30px] block size-[60px] rounded-[6px_33px_33px_33px] bg-accent"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 420, damping: 18 }}
        />
      )}
    </div>
  );
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz#%&*/<>";

/** Nama ter-decode dari karakter acak. */
function Scramble({ text }: { text: string }) {
  const [output, setOutput] = useState(() => text.replace(/./g, "·"));

  useEffect(() => {
    let frame = 0;
    const total = 12;
    const id = window.setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / total) * text.length);
      setOutput(
        text
          .split("")
          .map((ch, i) => (i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setOutput(text);
      }
    }, 38);
    return () => window.clearInterval(id);
  }, [text]);

  return <>{output}</>;
}
