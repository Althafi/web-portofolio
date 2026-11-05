import Image from "next/image";
import { Chip } from "@/components/ui/chip";
import { ProgressInView } from "@/components/effects/progress-in-view";
import { cn } from "@/lib/utils";
import { isReleased, statusText, type Project } from "@/lib/project-types";

/* ---------- Meta grid 4 kolom ---------- */

export function MetaGrid({ project }: { project: Project }) {
  const items = [
    { label: "Peran", value: project.role },
    { label: "Durasi", value: project.duration },
    { label: "Platform", value: project.platform },
    { label: "Status", value: statusText(project) },
  ];
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-[14px] border border-border lg:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "flex flex-col gap-1.5 px-5 py-[18px]",
            i % 2 === 1 && "border-l border-border",
            i >= 2 && "border-t border-border lg:border-t-0",
            i === 2 && "lg:border-l",
          )}
        >
          <dt className="text-label text-muted">{item.label}</dt>
          <dd className="text-base font-medium text-fg">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Sidebar ---------- */

export function TechStackCard({ stack }: { stack: string[] }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface p-5">
      <h2 className="text-[15px] font-semibold text-fg">Tech stack</h2>
      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <li key={tech}>
            <Chip variant="card">{tech}</Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}

const stepNotes = { done: "selesai", active: "berjalan" } as const;

export function RoadmapCard({ project }: { project: Project }) {
  if (isReleased(project) || !project.roadmap?.length) return null;
  const progress = project.progress ?? 0;

  return (
    <div className="rounded-[14px] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-fg">Roadmap rilis</h2>
        <span className="font-mono text-xs font-medium text-accent">{progress}%</span>
      </div>
      <ProgressInView value={progress} label="Progres menuju rilis" />
      <ol className="mt-3.5 space-y-3.5">
        {project.roadmap.map((step) => {
          const note =
            step.note ??
            (step.state === "todo" ? (project.releaseTarget ?? "nanti") : stepNotes[step.state]);
          return (
            <li key={step.label} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "status-dot relative size-2.5 shrink-0 rounded-full",
                  step.state === "done" && "bg-accent",
                  step.state === "active" && "border border-accent bg-accent-soft text-accent",
                  step.state === "todo" && "border border-muted",
                )}
                data-pulse={step.state === "active" || undefined}
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  step.state === "todo" ? "text-muted" : "text-fg",
                  step.state === "active" && "font-medium",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  step.state === "active" ? "text-accent" : "text-muted",
                )}
              >
                {note}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Galeri ---------- */

export function Gallery({ project }: { project: Pick<Project, "title" | "gallery"> }) {
  const shots = project.gallery?.slice(0, 3);
  return (
    <section aria-labelledby="galeri">
      <h2 id="galeri" className="scroll-mt-24 text-h3 text-fg">
        Galeri
      </h2>
      <ul className="mt-[17px] grid gap-6 sm:grid-cols-3">
        {shots?.length
          ? shots.map((shot) => (
              <li
                key={shot.src}
                className="relative aspect-[357/240] overflow-hidden rounded-[14px] border border-border bg-surface"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))
          : [1, 2, 3].map((n) => (
              <li
                key={n}
                className="grid aspect-[357/240] place-items-center rounded-[14px] border border-border bg-surface"
              >
                <span className="font-mono text-[11px] text-muted">
                  {project.title} · screenshot {n}
                </span>
              </li>
            ))}
      </ul>
    </section>
  );
}
