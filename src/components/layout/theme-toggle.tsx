"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useThemeSwitch } from "@/hooks/use-theme-switch";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const switchTheme = useThemeSwitch();

  return (
    <button
      type="button"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        switchTheme(resolvedTheme === "dark" ? "light" : "dark", {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }}
      aria-label="Toggle light/dark theme"
      className={cn(
        "grid size-9 place-items-center rounded-lg border border-border text-fg transition-colors hover:bg-surface",
        className,
      )}
    >
      {/* Icon is switched via CSS to avoid a hydration mismatch */}
      <Moon className="size-4 dark:hidden" fill="currentColor" strokeWidth={1.5} />
      <Sun className="hidden size-4 dark:block" strokeWidth={1.75} />
    </button>
  );
}
