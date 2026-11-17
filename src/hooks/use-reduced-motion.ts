"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/** `true` when the user has prefers-reduced-motion enabled. */
export function usePrefersReducedMotion() {
  return useReducedMotion() ?? false;
}

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const subscribeFine = subscribeMedia(FINE_POINTER);

/** `true` on devices with a mouse/trackpad. Heavy effects only run here. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

/** Heavy interactive effects (particles, tilt, parallax) only run when true. */
export function useRichMotion() {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  return fine && !reduced;
}
