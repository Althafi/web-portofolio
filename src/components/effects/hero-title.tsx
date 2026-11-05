"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * (02) Judul hero: muncul per kata (blur → tajam, CSS) lalu kata
 * "mobile", "web", dan "CLI" bergantian berputar seperti mesin slot.
 * Teks lengkap tetap ada untuk pembaca layar lewat aria-label.
 */

type Props = {
  text: string;
  /** Kata yang ikut "berputar" bergantian */
  slots: readonly string[];
  className?: string;
  id?: string;
};

function subscribePreloaded(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-preloaded"],
  });
  return () => observer.disconnect();
}
const getPreloaded = () => Boolean(document.documentElement.dataset.preloaded);

export function HeroTitle({ text, slots, className, id }: Props) {
  const words = text.split(" ");
  const reduced = usePrefersReducedMotion();
  const ready = useSyncExternalStore(subscribePreloaded, getPreloaded, () => false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!ready || reduced) return;
    let i = -1;
    const start = window.setTimeout(
      () => {
        i = 0;
        setActive(0);
      },
      words.length * 55 + 900,
    );
    const id = window.setInterval(() => {
      if (i < 0) return;
      i = (i + 1) % slots.length;
      setActive(i);
    }, 2200);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [ready, reduced, slots.length, words.length]);

  return (
    <h1 id={id} aria-label={text} className={className}>
      {words.map((word, i) => {
        const bare = word.replace(/[^\p{L}]/gu, "");
        const slotIndex = slots.indexOf(bare);
        return (
          <span key={i} aria-hidden>
            <span className="hero-word" style={{ "--i": i } as React.CSSProperties}>
              {slotIndex >= 0 ? <SlotWord word={word} spinning={active === slotIndex} /> : word}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </h1>
  );
}

function SlotWord({ word, spinning }: { word: string; spinning: boolean }) {
  const [turn, setTurn] = useState(0);
  const [prev, setPrev] = useState(spinning);
  // Setiap kali kata ini mendapat giliran, naikkan "putaran" supaya animasi jalan
  if (spinning !== prev) {
    setPrev(spinning);
    if (spinning) setTurn((t) => t + 1);
  }

  const punctuation = word.match(/[^\p{L}]+$/u)?.[0] ?? "";
  const bare = word.slice(0, word.length - punctuation.length);

  return (
    <>
      <span className="relative inline-grid overflow-hidden align-bottom">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={turn}
            className={cn(
              "col-start-1 row-start-1 transition-colors duration-500",
              spinning && "text-accent",
            )}
            initial={{ y: "-100%", filter: "blur(4px)" }}
            animate={{ y: "0%", filter: "blur(0px)" }}
            exit={{ y: "100%", filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {bare}
          </motion.span>
        </AnimatePresence>
      </span>
      {punctuation}
    </>
  );
}
