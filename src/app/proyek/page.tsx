import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProjectsExplorer } from "@/components/project/projects-explorer";
import { ContactCta } from "@/components/sections/contact-cta";
import { getAllProjects, getCategoryCounts } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Proyek",
  description:
    "Kumpulan aplikasi mobile, web, dan tools yang pernah saya bangun — lengkap dengan studi kasusnya.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const counts = getCategoryCounts();

  return (
    <>
      <Container className="pt-14">
        <h1 className="text-title text-fg">Proyek</h1>
        <p className="mt-1.5 text-[17px] text-muted">
          Kumpulan aplikasi mobile, web, dan tools yang pernah saya bangun — lengkap dengan studi
          kasusnya.
        </p>
        <div className="mt-[42px]">
          <ProjectsExplorer projects={projects} counts={counts} />
        </div>
      </Container>
      <ContactCta />
    </>
  );
}
