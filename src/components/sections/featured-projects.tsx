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
    <section aria-labelledby="proyek-pilihan" className="pt-20">
      <Container>
        <SectionHeading
          id="proyek-pilihan"
          title="Proyek pilihan"
          description="Beberapa hal yang sudah saya bangun dan rilis."
          action={{ label: "Semua proyek", href: "/proyek" }}
        />
        {/* useSearchParams butuh Suspense; fallback = tampilan "Semua" yang identik */}
        <Suspense fallback={<FeaturedGridStatic projects={projects} counts={counts} />}>
          <FeaturedGrid projects={projects} counts={counts} />
        </Suspense>
      </Container>
    </section>
  );
}
