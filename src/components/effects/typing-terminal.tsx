"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * (07) Output terminal diketik saat kartu masuk viewport, lalu caret berkedip.
 * Ruang teks penuh selalu dipesan (teks tak terlihat di bawahnya) supaya layout tidak bergeser.
 */
export function TypingTerminal({ lines }: { lines: string[] }) {
  const full = `${lines.join("\n")}\n$ `;
  const ref = useRef<HTMLPreElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= full.length) {
          window.clearInterval(id);
          return c;
        }
        // Baris perintah ($) diketik lebih lambat dari output
        return c + 1;
      });
    }, 22);
    return () => window.clearInterval(id);
  }, [inView, reduced, full.length]);

  const shown = reduced ? full : full.slice(0, count);

  return (
    <pre
      ref={ref}
      className="relative mt-3.5 font-mono text-[11px] leading-[1.6] whitespace-pre text-[#d4d4d8]"
    >
      <span className="sr-only">{full}</span>
      <span aria-hidden className="invisible">
        {full}█
      </span>
      <span aria-hidden className="absolute inset-0">
        {shown}
        <span className="caret">█</span>
      </span>
    </pre>
  );
}
