"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { categories, type Category } from "@/lib/project-types";
import type { Filter } from "@/components/project/filter-tabs";

const PARAM = "category";

function parse(value: string | null, allowed: readonly Category[]): Filter {
  return value && (allowed as readonly string[]).includes(value) ? (value as Filter) : "all";
}

/**
 * Category filter stored in the URL (`?category=mobile`) so it can be shared.
 * Uses the native history API, which stays in sync with useSearchParams automatically.
 */
export function useCategoryFilter(allowed: readonly Category[] = categories) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filter = parse(searchParams.get(PARAM), allowed);

  const setFilter = useCallback(
    (next: Filter) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete(PARAM);
      else params.set(PARAM, next);
      const query = params.toString();
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    },
    [pathname, searchParams],
  );

  return [filter, setFilter] as const;
}
