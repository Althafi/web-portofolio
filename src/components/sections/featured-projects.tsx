import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FilterTabs } from "@/components/project/filter-tabs";
import { ProjectCard } from "@/components/project/project-card";
import type { CategoryCounts, Project } from "@/lib/project-types";

type Props = {
  projects: Project[];
  counts: CategoryCounts;
};

export function FeaturedProjects({ projects, counts }: Props) {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section aria-labelledby="proyek-pilihan" className="pt-20">
      <Container>
        <SectionHeading
          id="proyek-pilihan"
          title="Proyek pilihan"
          description="Beberapa hal yang sudah saya bangun dan rilis."
          action={{ label: "Semua proyek", href: "/proyek" }}
        />
        <FilterTabs counts={counts} value="all" className="mt-[35px]" />
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
