import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeaturedGrid, FeaturedGridStatic } from "@/components/sections/featured-grid";
import type { CategoryCounts, Project } from "@/lib/project-types";

type Props = {
  projects: Project[];
  counts: CategoryCounts;
};

export function FeaturedProjects({ projects, counts }: Props) {
  return (
    <section aria-labelledby="featured-projects" className="pt-20">
      <Container>
        <SectionHeading
          id="featured-projects"
          title="Featured projects"
          description="A few things I've built and shipped."
          action={{ label: "All projects", href: "/projects" }}
        />
        {/* useSearchParams needs Suspense; fallback = the identical "All" view */}
        <Suspense fallback={<FeaturedGridStatic projects={projects} counts={counts} />}>
          <FeaturedGrid projects={projects} counts={counts} />
        </Suspense>
      </Container>
    </section>
  );
}
