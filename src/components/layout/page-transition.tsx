"use client";

import { ViewTransition } from "react";

/**
 * (10) Transisi halaman: konten lama memudar, konten baru fade + naik 12px.
 * Dipasang di tiap page.tsx (bukan layout) supaya enter/exit berjalan saat navigasi.
 * Elemen bernama di dalamnya (thumbnail ↔ showcase) ikut ber-morph.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
