"use client";

import { EmptyState } from "@/components/project/empty-state";
import { FilterTabs, type Filter } from "@/components/project/filter-tabs";
import { AnimatedProjectGrid } from "@/components/project/animated-grid";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import {
  categoryLabels,
  homeCategories,
  type CategoryCounts,
  type Project,
} from "@/lib/project-types";

type Props = { projects: Project[]; counts: CategoryCounts };

/** Up to 3 cards: featured projects first, then the rest by order. */
function pick(projects: Project[], filter: Filter) {
  return projects
    .filter((p) => filter === "all" || p.category === filter)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, 3);
}

/** URL-state version — must be rendered inside <Suspense>. */
export function FeaturedGrid(props: Props) {
  const [filter, setFilter] = useCategoryFilter(homeCategories);
  return <FeaturedGridView {...props} filter={filter} onFilterChange={setFilter} />;
}

/** Static fallback during prerender. */
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
      <FilterTabs
        counts={counts}
        value={filter}
        onChange={onFilterChange}
        categories={homeCategories}
        className="mt-[35px]"
      />
      {items.length > 0 ? (
        <AnimatedProjectGrid projects={items} className="mt-8" />
      ) : (
        <EmptyState
          className="mt-8"
          title={`No ${categoryLabels[filter as Exclude<Filter, "all">].toLowerCase()} projects yet`}
          description="Projects in this category are in the works. Cards will show up here automatically once they ship."
        />
      )}
    </>
  );
}
