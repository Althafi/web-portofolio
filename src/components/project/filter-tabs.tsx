"use client";

import {
  categories,
  categoryLabels,
  type Category,
  type CategoryCounts,
} from "@/lib/project-types";
import { useId } from "react";
import { LayoutGroup, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Filter = Category | "all";

function filterOptions(shown: readonly Category[]): { value: Filter; label: string }[] {
  return [
    { value: "all", label: "All" },
    ...shown.map((c) => ({ value: c, label: categoryLabels[c] })),
  ];
}

type Props = {
  counts: CategoryCounts;
  value: Filter;
  onChange?: (value: Filter) => void;
  className?: string;
  label?: string;
  /** Categories to offer as tabs (defaults to all). */
  categories?: readonly Category[];
};

/** Segmented control for category filtering, with project counts. */
export function FilterTabs({
  counts,
  value,
  onChange,
  className,
  label = "Filter by category",
  categories: shown = categories,
}: Props) {
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <div
        role="tablist"
        aria-label={label}
        className={cn(
          "inline-flex h-10 items-center gap-0.5 rounded-[10px] bg-surface p-1",
          className,
        )}
      >
        {filterOptions(shown).map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange?.(opt.value)}
              className={cn(
                "relative flex h-8 items-center gap-1.5 rounded-[7px] px-3 text-sm font-medium transition-colors",
                active ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {/* (06) Indicator slides between tabs */}
              {active && (
                <motion.span
                  layoutId="tab-indicator"
                  aria-hidden
                  className="absolute inset-0 rounded-[7px] bg-bg shadow-[0_1px_3px_rgb(0_0_0/0.08)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{opt.label}</span>
              <span className="relative font-mono text-xs font-normal text-muted">
                {counts[opt.value]}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
