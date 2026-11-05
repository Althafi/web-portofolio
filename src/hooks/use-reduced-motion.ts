"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/** `true` bila pengguna mengaktifkan prefers-reduced-motion. */
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

/** `true` di perangkat dengan mouse/trackpad. Efek berat hanya aktif di sini. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

/** Efek interaktif berat (partikel, tilt, parallax) hanya jalan bila true. */
export function useRichMotion() {
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  return fine && !reduced;
}
