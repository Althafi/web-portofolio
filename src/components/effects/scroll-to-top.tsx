"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/** Floating "back to top" button that appears once the page is scrolled past the hero. */
export function ScrollToTop({ threshold = 600 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      inert={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      className={cn(
        "fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border border-border bg-bg/80 text-fg shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none sm:right-6 sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="size-[18px]" aria-hidden />
    </button>
  );
}
