import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { StatusPill } from "@/components/ui/status-pill";
import { ProjectThumb } from "@/components/project/project-thumb";
import {
  badgeLabel,
  isReleased,
  primaryAction,
  statusLabels,
  type Project,
} from "@/lib/project-types";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const action = primaryAction(project);

  return (
    <article
      className={cn(
        "relative flex h-[436px] flex-col overflow-hidden rounded-2xl border border-border bg-bg",
        className,
      )}
    >
      <div className="relative h-[220px] shrink-0 overflow-hidden border-b border-border bg-surface">
        <ProjectThumb project={project} />
        {!isReleased(project) && (
          <StatusPill className="absolute top-3 left-3">{statusLabels[project.status]}</StatusPill>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5">
        <div className="flex items-center justify-between">
          <Badge>{badgeLabel(project)}</Badge>
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>
        <h3 className="mt-3 text-h4 text-fg">{project.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-normal text-muted">{project.summary}</p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden" aria-label="Tech stack">
          {project.stack.slice(0, 3).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-10 items-center justify-between border-t border-border px-5 text-[13px]">
        <Link
          href={`/proyek/${project.slug}`}
          className="font-medium text-fg underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          Lihat detail<span aria-hidden>&nbsp;&nbsp;→</span>
          <span className="sr-only">: {project.title}</span>
        </Link>
        {action?.kind === "demo" && (
          <button
            type="button"
            data-demo={project.slug}
            className="relative z-10 text-muted transition-colors hover:text-fg"
          >
            {action.label} <span aria-hidden>▶</span>
            <span className="sr-only">: {project.title}</span>
          </button>
        )}
        {action?.kind === "link" && (
          <a
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 text-muted transition-colors hover:text-fg"
          >
            {action.label} <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
