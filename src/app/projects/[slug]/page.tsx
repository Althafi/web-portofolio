import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageTransition } from "@/components/layout/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/project/project-card";
import { DemoDialog } from "@/components/project/demo-dialog";
import { Gallery, MetaGrid, RoadmapCard, TechStackCard } from "@/components/project/detail-parts";
import { ParallaxShowcase } from "@/components/effects/parallax-showcase";
import { ActiveToc } from "@/components/effects/active-toc";
import { ReadingProgress } from "@/components/effects/reading-progress";
import { badgeLabel, primaryAction } from "@/lib/project-types";
import { getAllProjects, getOtherProjects, getProject, loadProjectContent } from "@/lib/projects";

// All slugs are prerendered via generateStaticParams. Other slugs may
// "block" so that notFound() returns a proper 404 status.
export const instant = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { type: "article", title: project.title, description: project.tagline },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const Content = await loadProjectContent(slug);
  const others = getOtherProjects(slug);
  const action = primaryAction(project);
  const showGithub =
    project.links.github && !(action?.kind === "link" && action.href === project.links.github);
  const toc = [...project.headings, { id: "gallery", title: "Gallery" }];

  return (
    <PageTransition>
      <Container className="pt-11 pb-[76px]">
        <ReadingProgress />
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to projects
        </Link>

        {/* Header */}
        <header className="mt-[34px] flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-5">
              <Badge>{badgeLabel(project)}</Badge>
              <span className="font-mono text-xs text-muted">Case study · {project.year}</span>
            </div>
            <h1 className="mt-3.5 flex items-center gap-[0.3em] text-display text-fg">
              {project.logo && (
                <Image
                  src={project.logo}
                  alt=""
                  width={112}
                  height={112}
                  loading="eager"
                  className="size-[1.05em] shrink-0 rounded-[0.24em] shadow-[0_6px_18px_-8px_rgb(0_0_0/0.45)]"
                />
              )}
              {project.title}
            </h1>
            <p className="mt-1 text-xl leading-normal text-muted">{project.tagline}</p>
          </div>
          <div className="flex shrink-0 gap-2.5 lg:mt-9">
            {action?.kind === "demo" && (
              <DemoDialog project={project}>
                <Button variant="primary" size="md">
                  {action.label} <span aria-hidden>▶</span>
                </Button>
              </DemoDialog>
            )}
            {action?.kind === "link" && (
              <Button asChild variant="primary" size="md">
                <a href={action.href} target="_blank" rel="noreferrer">
                  {action.label} <span aria-hidden>↗</span>
                </a>
              </Button>
            )}
            {showGithub && (
              <Button asChild variant="secondary" size="md">
                <a href={project.links.github} target="_blank" rel="noreferrer">
                  GitHub <span aria-hidden>↗</span>
                </a>
              </Button>
            )}
          </div>
        </header>

        <div className="mt-[50px] space-y-10">
          <MetaGrid project={project} />
          <ParallaxShowcase project={project} />
        </div>

        {/* Case study content + sidebar */}
        <div className="mt-[68px] grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
          <article className="min-w-0 max-w-[680px] space-y-3">
            <Content />
          </article>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="max-lg:hidden">
              <ActiveToc items={toc} />
            </div>
            <TechStackCard stack={project.stack} />
            <RoadmapCard project={project} />
          </aside>
        </div>

        <div className="mt-[60px]">
          <Gallery project={project} />
        </div>

        {others.length > 0 && (
          <section aria-labelledby="more-projects" className="mt-[74px]">
            <SectionHeading
              id="more-projects"
              title="More projects"
              action={{ label: "All projects", href: "/projects" }}
              size="sm"
            />
            <ul className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </PageTransition>
  );
}
