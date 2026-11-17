"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

type ThemeChoice = "light" | "dark" | "system";

/**
 * (09) Switch theme with a circle expanding from the origin point (View Transitions API).
 * Older browsers → 300 ms color fade. Reduced motion → instant switch.
 */
export function useThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  return useCallback(
    (next: ThemeChoice, origin?: { x: number; y: number }) => {
      const root = document.documentElement;
      const target =
        next === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : next;

      const apply = () => {
        root.classList.toggle("dark", target === "dark");
        root.classList.toggle("light", target === "light");
        root.style.colorScheme = target;
        flushSync(() => setTheme(next));
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (target === resolvedTheme || reduced) {
        apply();
        return;
      }

      if (!document.startViewTransition) {
        root.classList.add("theme-fade");
        apply();
        window.setTimeout(() => root.classList.remove("theme-fade"), 350);
        return;
      }

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      root.classList.add("theme-vt", "theme-freeze");
      const transition = document.startViewTransition(apply);
      transition.ready
        .then(() =>
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
              duration: 560,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            },
          ),
        )
        .catch(() => {});
      transition.finished.finally(() => root.classList.remove("theme-vt", "theme-freeze"));
    },
    [resolvedTheme, setTheme],
  );
}
