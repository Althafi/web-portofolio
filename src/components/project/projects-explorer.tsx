"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/project/empty-state";
import { FilterTabs, type Filter } from "@/components/project/filter-tabs";
import { ProjectCard } from "@/components/project/project-card";
import {
  categories,
  categoryLabels,
  type Category,
  type CategoryCounts,
  type Project,
} from "@/lib/project-types";

const emptyCopy: Record<Category, { title: string; description: string }> = {
  mobile: {
    title: "Belum ada proyek mobile",
    description: "Proyek mobile berikutnya sedang dikerjakan. Kartu akan muncul otomatis di sini setelah rilis.",
  },
  web: {
    title: "Belum ada proyek web",
    description: "Proyek web pertama sedang dikerjakan. Kartu akan muncul otomatis di sini setelah rilis.",
  },
  tools: {
    title: "Belum ada tools",
    description: "Tools berikutnya sedang dikerjakan. Kartu akan muncul otomatis di sini setelah rilis.",
  },
};

type Props = {
  projects: Project[];
  counts: CategoryCounts;
};

/** Daftar proyek per kategori + filter tab + pencarian. */
export function ProjectsExplorer({ projects, counts }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? categories : [filter];

  return (
    <div>
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs counts={counts} value={filter} onChange={setFilter} />
        <label className="relative flex h-10 w-full items-center rounded-[10px] border border-border bg-bg sm:w-[280px]">
          <Search className="pointer-events-none absolute left-3.5 size-[15px] text-muted" aria-hidden />
          <span className="sr-only">Cari proyek</span>
          <input
            type="search"
            placeholder="Cari proyek atau teknologi…"
            className="h-full w-full rounded-[10px] bg-transparent pr-3 pl-9 text-sm text-fg outline-none placeholder:text-muted"
          />
        </label>
      </div>

      <div className="mt-12 space-y-11">
        {visible.map((category) => {
          const items = projects.filter((p) => p.category === category);
          return (
            <section key={category} aria-labelledby={`grup-${category}`}>
              <h2 id={`grup-${category}`} className="flex items-baseline gap-2.5">
                <span className="text-h4 text-fg">{categoryLabels[category]}</span>
                <span className="font-mono text-[13px] text-muted">
                  {String(items.length).padStart(2, "0")}
                </span>
              </h2>
              {items.length > 0 ? (
                <ul className="mt-[18px] grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((project) => (
                    <li key={project.slug}>
                      <ProjectCard project={project} />
                    </li>
                  ))}
                </ul>
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
