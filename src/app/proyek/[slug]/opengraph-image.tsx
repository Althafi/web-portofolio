import { renderOg, ogSize } from "@/lib/og";
import { badgeLabel, statusText } from "@/lib/project-types";
import { getAllProjects, getProject } from "@/lib/projects";

export const alt = "Studi kasus proyek";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return renderOg({ eyebrow: "Proyek", title: "Tidak ditemukan", description: "" });
  }
  return renderOg({
    eyebrow: `${badgeLabel(project)} · ${statusText(project)}`,
    title: project.title,
    description: project.tagline,
  });
}
