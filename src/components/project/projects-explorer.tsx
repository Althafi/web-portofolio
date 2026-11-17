"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { EmptyState } from "@/components/project/empty-state";
import { FilterTabs, type Filter } from "@/components/project/filter-tabs";
import { AnimatedProjectGrid } from "@/components/project/animated-grid";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import {
  categories,
  categoryLabels,
  type Category,
  type CategoryCounts,
  type Project,
} from "@/lib/project-types";

const emptyCopy: Record<Category, { title: string; description: string }> = {
  mobile: {
    title: "No mobile projects yet",
    description:
      "The next mobile project is in the works. Its card will show up here automatically once it ships.",
  },
  web: {
    title: "No web projects yet",
    description:
      "The first web project is in the works. Its card will show up here automatically once it ships.",
  },
};

type Props = {
  projects: Project[];
  counts: CategoryCounts;
};

function matches(project: Project, query: string) {
  if (!query) return true;
  const haystack = [project.title, project.summary, project.kind ?? "", ...project.stack]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

/** URL-state version — must be rendered inside <Suspense>. */
export function ProjectsExplorer(props: Props) {
  const [filter, setFilter] = useCategoryFilter();
  return <ProjectsExplorerView {...props} filter={filter} onFilterChange={setFilter} />;
}

/** Static version (Suspense fallback during prerender): "All" filter. */
export function ProjectsExplorerStatic(props: Props) {
  return <ProjectsExplorerView {...props} filter="all" />;
}

function ProjectsExplorerView({
  projects,
  counts,
  filter,
  onFilterChange,
}: Props & { filter: Filter; onFilterChange?: (f: Filter) => void }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const searching = deferredQuery.length > 0;
  const visible = filter === "all" ? categories : [filter];

  const groups = visible.map((category) => ({
    category,
    items: projects.filter((p) => p.category === category && matches(p, deferredQuery)),
  }));
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs counts={counts} value={filter} onChange={onFilterChange} />
        <div className="relative flex h-10 w-full items-center rounded-[10px] border border-border bg-bg focus-within:border-accent sm:w-[280px]">
          <Search
            className="pointer-events-none absolute left-3.5 size-[15px] text-muted"
            aria-hidden
          />
          <label htmlFor="project-search" className="sr-only">
            Search projects or technologies
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or technologies…"
            autoComplete="off"
            className="h-full w-full rounded-[10px] bg-transparent pr-9 pl-9 text-sm text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 grid size-6 place-items-center rounded-md text-muted hover:bg-surface hover:text-fg"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {searching ? `${total} ${total === 1 ? "project matches" : "projects match"} “${deferredQuery}”` : ""}
      </p>

      <div className="mt-12 space-y-11">
        {searching && total === 0 && (
          <EmptyState
            badge="0 results"
            title="No matching projects"
            description={`No projects or technologies match “${deferredQuery}”. Try another keyword, like Flutter or Go.`}
          />
        )}
        {groups.map(({ category, items }) => {
          if (searching && items.length === 0) return null;
          return (
            <section key={category} aria-labelledby={`group-${category}`}>
              <h2 id={`group-${category}`} className="flex items-baseline gap-2.5">
                <span className="text-h4 text-fg">{categoryLabels[category]}</span>
                <span className="font-mono text-[13px] text-muted">
                  {String(items.length).padStart(2, "0")}
                </span>
              </h2>
              {items.length > 0 ? (
                <AnimatedProjectGrid projects={items} className="mt-[18px]" />
              ) : (
                <EmptyState className="mt-[18px]" {...emptyCopy[category]} />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
