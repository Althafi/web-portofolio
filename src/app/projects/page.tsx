import { PageTransition } from "@/components/layout/page-transition";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Suspense } from "react";
import { ProjectsExplorer, ProjectsExplorerStatic } from "@/components/project/projects-explorer";
import { ContactCta } from "@/components/sections/contact-cta";
import { getAllProjects, getCategoryCounts } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of mobile and web apps I've built — each with its own case study.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const counts = getCategoryCounts();

  return (
    <PageTransition>
      <Container className="pt-14">
        <h1 className="text-title text-fg">Projects</h1>
        <p className="mt-1.5 text-[17px] text-muted">
          A collection of mobile and web apps I&apos;ve built — each with its own case study.
        </p>
        <div className="mt-[42px]">
          <Suspense fallback={<ProjectsExplorerStatic projects={projects} counts={counts} />}>
            <ProjectsExplorer projects={projects} counts={counts} />
          </Suspense>
        </div>
      </Container>
      <ContactCta />
    </PageTransition>
  );
}
