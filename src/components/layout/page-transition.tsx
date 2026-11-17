"use client";

import { ViewTransition } from "react";

/**
 * (10) Page transition: old content fades out, new content fades in + rises 12px.
 * Placed in each page.tsx (not the layout) so enter/exit runs on navigation.
 * Named elements inside it (thumbnail ↔ showcase) morph as well.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
