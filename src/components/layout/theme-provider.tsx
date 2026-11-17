"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes renders an inline <script> that sets the theme before paint.
 * It runs from the server HTML; if React ever re-creates it on the client
 * (e.g. remount after an error), React 19 warns about the script tag. Marking
 * it as a data block on the client silences that without changing behavior.
 */
const scriptProps = {
  type: typeof window === "undefined" ? "text/javascript" : "text/plain",
} as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
