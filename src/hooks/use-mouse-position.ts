"use client";

import { useEffect, type RefObject } from "react";

/**
 * Menulis posisi kursor relatif terhadap elemen ke CSS variable
 * `--mx` / `--my` (px), tanpa re-render React. Dipakai spotlight & glow.
 */
export function useMousePosition(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        el!.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el!.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    }
    el.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
    };
  }, [ref, enabled]);
}
