"use client";

import {
  categories,
  categoryLabels,
  type Category,
  type CategoryCounts,
} from "@/lib/project-types";
import { cn } from "@/lib/utils";

export type Filter = Category | "all";

export const filterOptions: { value: Filter; label: string }[] = [
  { value: "all", label: "Semua" },
  ...categories.map((c) => ({ value: c, label: categoryLabels[c] })),
];

type Props = {
  counts: CategoryCounts;
  value: Filter;
  onChange?: (value: Filter) => void;
  className?: string;
  label?: string;
};

/** Segmented control filter kategori dengan jumlah proyek. */
export function FilterTabs({ counts, value, onChange, className, label = "Filter kategori" }: Props) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("inline-flex h-10 items-center gap-0.5 rounded-[10px] bg-surface p-1", className)}
    >
      {filterOptions.map((opt) => {
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
              active
                ? "bg-bg text-fg shadow-[0_1px_3px_rgb(0_0_0/0.08)]"
                : "text-muted hover:text-fg",
            )}
          >
            {opt.label}
            <span className="font-mono text-xs font-normal text-muted">{counts[opt.value]}</span>
          </button>
        );
      })}
    </div>
  );
}
