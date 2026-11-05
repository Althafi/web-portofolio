"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Ganti tema terang/gelap"
      className={cn(
        "grid size-9 place-items-center rounded-lg border border-border text-fg transition-colors hover:bg-surface",
        className,
      )}
    >
      {/* Ikon diatur lewat CSS supaya tidak ada hydration mismatch */}
      <Moon className="size-4 dark:hidden" fill="currentColor" strokeWidth={1.5} />
      <Sun className="hidden size-4 dark:block" strokeWidth={1.75} />
    </button>
  );
}
