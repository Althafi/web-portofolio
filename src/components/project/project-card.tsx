"use client";

import { useRef, useState, ViewTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { TechIcon } from "@/components/ui/tech-icon";
import { StatusPill } from "@/components/ui/status-pill";
import { ProjectThumb } from "@/components/project/project-thumb";
import { DemoDialog } from "@/components/project/demo-dialog";
import {
  badgeLabel,
  isReleased,
  primaryAction,
  statusLabels,
  statusPillTone,
  storeLinks,
  type Project,
} from "@/lib/project-types";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useMousePosition(ref);

  return (
    <article
      ref={ref}
      aria-label={project.title}
      className={cn("group/card relative h-[472px] [perspective:1400px]", className)}
    >
      {/* The flip button comes before both faces so the Tab order is logical */}
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`Flip ${project.title} card: ${flipped ? "back to front" : "see numbers & highlights"}`}
        onClick={() => setFlipped((v) => !v)}
        className={cn(
          "absolute z-20 grid size-8 place-items-center rounded-full border text-[15px] font-medium transition-all duration-300",
          flipped
            ? "top-6 right-6 border-inverse-fg/20 text-inverse-fg hover:bg-inverse-fg/10"
            : "top-3 right-3 border-border bg-bg text-fg hover:bg-surface",
        )}
      >
        <span aria-hidden>{flipped ? "↺" : "↻"}</span>
      </button>

      <div
        className={cn(
          "relative h-full transition-transform duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] [transform-style:preserve-3d] motion-reduce:transition-none",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <CardFront project={project} hidden={flipped} />
        <CardBack project={project} hidden={!flipped} />
      </div>
    </article>
  );
}

/**
 * The inactive face is fully hidden after the flip animation (500 ms)
 * so screen readers / contrast audit tools don't pick it up.
 */
function faceVisibility(hidden: boolean) {
  return hidden
    ? "invisible [transition:visibility_0s_linear_500ms]"
    : "visible [transition:visibility_0s]";
}

function CardFront({ project, hidden }: { project: Project; hidden: boolean }) {
  const action = primaryAction(project);

  return (
    <div
      inert={hidden}
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border bg-bg [backface-visibility:hidden]",
        faceVisibility(hidden),
      )}
    >
      {/* (05) Blue spotlight follows the cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />
      {/* (10) Thumbnail "flies" into the showcase on the detail page */}
      <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
        <div className="relative h-[220px] shrink-0 overflow-hidden border-b border-border bg-surface">
          <ProjectThumb project={project} />
          {!isReleased(project) && (
            <StatusPill className="absolute top-3 left-3" {...statusPillTone(project.status)}>
              {statusLabels[project.status]}
            </StatusPill>
          )}
        </div>
      </ViewTransition>

      <div className="flex flex-1 flex-col px-5 pt-5">
        <div className="flex items-center justify-between">
          <Badge>{badgeLabel(project)}</Badge>
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>
        <h3 className="mt-3 text-h4 text-fg">{project.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-normal text-muted">{project.summary}</p>
        <ul className="mt-2.5 flex max-h-[54px] flex-wrap gap-1.5 overflow-hidden" aria-label="Tech stack">
          {project.stack.slice(0, 3).map((tech) => (
            <li key={tech} className="flex">
              <Chip className="gap-1.5">
                <TechIcon name={tech} className="size-3" />
                {tech}
              </Chip>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-10 items-center justify-between border-t border-border px-5 text-[13px]">
        <Link
          href={`/projects/${project.slug}`}
          className="font-medium text-fg underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          View details<span aria-hidden>&nbsp;&nbsp;→</span>
          <span className="sr-only">: {project.title}</span>
        </Link>
        {action?.kind === "demo" && (
          <DemoDialog project={project}>
            <button
              type="button"
              className="relative z-10 text-muted transition-colors hover:text-fg"
            >
              {action.label} <span aria-hidden>▶</span>
              <span className="sr-only">: {project.title}</span>
            </button>
          </DemoDialog>
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
    </div>
  );
}

function CardBack({ project, hidden }: { project: Project; hidden: boolean }) {
  const external = isReleased(project) ? storeLinks(project)[0] : undefined;
  const secondary =
    external ??
    (project.links.github ? { label: "GitHub", href: project.links.github } : undefined);

  return (
    <div
      inert={hidden}
      className={cn(
        "absolute inset-0 flex flex-col gap-[18px] overflow-hidden rounded-2xl bg-inverse-bg p-6 text-inverse-fg [backface-visibility:hidden] [transform:rotateY(180deg)]",
        faceVisibility(hidden),
      )}
    >
      <p className="flex h-8 items-center pr-10 text-h4">{project.title}</p>

      {project.stats?.length ? (
        <dl className="grid grid-cols-3 gap-2">
          {project.stats.slice(0, 3).map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-0.5 rounded-[10px] bg-inverse-fg/[0.07] p-3"
            >
              <dt className="text-xs text-inverse-fg/60">{stat.label}</dt>
              <dd className="text-[22px] leading-tight font-semibold text-accent-inverse">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div>
        <p className="font-mono text-[11px] text-inverse-fg/60">HIGHLIGHTS</p>
        <ul className="mt-2.5 space-y-1 text-sm">
          {project.highlights.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <Button asChild variant="accent" size="md-sm">
          <Link href={`/projects/${project.slug}`}>
            Case study <span aria-hidden>→</span>
          </Link>
        </Button>
        {secondary && (
          <Button
            asChild
            variant="ghost"
            size="md-sm"
            className="border-inverse-fg/20 text-inverse-fg hover:bg-inverse-fg/10 hover:text-inverse-fg dark:hover:bg-inverse-fg/10"
          >
            <a href={secondary.href} target="_blank" rel="noreferrer">
              {secondary.label} <span aria-hidden>↗</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
