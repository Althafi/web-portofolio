"use client";

import { EmptyState } from "@/components/project/empty-state";
import { FilterTabs, type Filter } from "@/components/project/filter-tabs";
import { AnimatedProjectGrid } from "@/components/project/animated-grid";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import { categoryLabels, type CategoryCounts, type Project } from "@/lib/project-types";

type Props = { projects: Project[]; counts: CategoryCounts };

function pick(projects: Project[], filter: Filter) {
  if (filter === "all") return projects.filter((p) => p.featured).slice(0, 3);
  return projects
    .filter((p) => p.category === filter)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, 3);
}

/** Versi dengan state di URL — harus dirender di dalam <Suspense>. */
export function FeaturedGrid(props: Props) {
  const [filter, setFilter] = useCategoryFilter();
  return <FeaturedGridView {...props} filter={filter} onFilterChange={setFilter} />;
}

/** Fallback statis saat prerender. */
export function FeaturedGridStatic(props: Props) {
  return <FeaturedGridView {...props} filter="all" />;
}

function FeaturedGridView({
  projects,
  counts,
  filter,
  onFilterChange,
}: Props & { filter: Filter; onFilterChange?: (f: Filter) => void }) {
  const items = pick(projects, filter);

  return (
    <>
      <FilterTabs counts={counts} value={filter} onChange={onFilterChange} className="mt-[35px]" />
      {items.length > 0 ? (
        <AnimatedProjectGrid projects={items} className="mt-8" />
      ) : (
        <EmptyState
          className="mt-8"
          title={`Belum ada proyek ${categoryLabels[filter as Exclude<Filter, "all">].toLowerCase()}`}
          description="Proyek di kategori ini sedang dikerjakan. Kartu akan muncul otomatis di sini setelah rilis."
        />
      )}
    </>
  );
}
