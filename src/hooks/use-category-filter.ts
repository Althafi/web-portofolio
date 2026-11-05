"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { categories } from "@/lib/project-types";
import type { Filter } from "@/components/project/filter-tabs";

const PARAM = "kategori";

function parse(value: string | null): Filter {
  return value && (categories as readonly string[]).includes(value) ? (value as Filter) : "all";
}

/**
 * Filter kategori yang disimpan di URL (`?kategori=mobile`) supaya bisa dibagikan.
 * Memakai history API bawaan, yang otomatis tersinkron dengan useSearchParams.
 */
export function useCategoryFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filter = parse(searchParams.get(PARAM));

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
