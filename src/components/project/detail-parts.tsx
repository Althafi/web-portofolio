import Image from "next/image";
import { Chip } from "@/components/ui/chip";
import { TechIcon } from "@/components/ui/tech-icon";
import { ProgressInView } from "@/components/effects/progress-in-view";
import { cn } from "@/lib/utils";
import { isReleased, statusText, type Project } from "@/lib/project-types";

/* ---------- 4-column meta grid ---------- */

export function MetaGrid({ project }: { project: Project }) {
  const items = [
    { label: "Role", value: project.role },
    { label: "Duration", value: project.duration },
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
            <Chip variant="card" className="gap-1.5">
              <TechIcon name={tech} />
              {tech}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}

const stepNotes = { done: "done", active: "in progress" } as const;

export function RoadmapCard({ project }: { project: Project }) {
  if (isReleased(project) || !project.roadmap?.length) return null;
  const progress = project.progress ?? 0;

  return (
    <div className="rounded-[14px] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-fg">Release roadmap</h2>
        <span className="font-mono text-xs font-medium text-accent">{progress}%</span>
      </div>
      <ProgressInView value={progress} label="Progress toward release" />
      <ol className="mt-3.5 space-y-3.5">
        {project.roadmap.map((step) => {
          const note =
            step.note ??
            (step.state === "todo" ? (project.releaseTarget ?? "later") : stepNotes[step.state]);
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

/* ---------- Gallery ---------- */

export function Gallery({ project }: { project: Pick<Project, "title" | "gallery"> }) {
  const shots = project.gallery?.slice(0, 3);
  return (
    <section aria-labelledby="gallery">
      <h2 id="gallery" className="scroll-mt-24 text-h3 text-fg">
        Gallery
      </h2>
      <ul className="mt-[17px] grid gap-6 sm:grid-cols-3">
        {shots?.length
          ? shots.map((shot, i) => (
              <li key={shot.src ?? shot.screens?.join() ?? i}>
                <figure>
                  {shot.screens?.length ? (
                    <PhoneMockup screens={shot.screens} alt={shot.alt} />
                  ) : shot.src ? (
                    <div className="relative aspect-[357/240] overflow-hidden rounded-[14px] border border-border bg-surface">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  {shot.caption && (
                    <figcaption className="mt-3 text-sm font-medium text-fg">{shot.caption}</figcaption>
                  )}
                </figure>
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

/**
 * 1–3 phone screenshots in device frames on a card, center phone in front.
 * Sized in container units (cqw) so the frames scale with the card.
 */
const mockupSlots = {
  left: "top-[20%] left-[7%] w-[29%] bg-[#27272a] motion-safe:group-hover:-translate-y-[1.5%]",
  center: "z-10 top-[9%] left-[33%] w-[34%] bg-[#3f3f46] motion-safe:group-hover:-translate-y-[3%]",
  right: "top-[20%] right-[7%] w-[29%] bg-[#27272a] motion-safe:group-hover:-translate-y-[1.5%]",
} as const;

function PhoneMockup({ screens, alt }: { screens: string[]; alt: string }) {
  const [a, b, c] = screens;
  const phones: [keyof typeof mockupSlots, string][] =
    screens.length === 1
      ? [["center", a]]
      : screens.length === 2
        ? [["left", a], ["center", b]]
        : [["left", a], ["right", c], ["center", b]];

  return (
    <div
      role="img"
      aria-label={alt}
      className="group @container relative aspect-[357/260] overflow-hidden rounded-[14px] border border-border bg-surface"
    >
      <span
        aria-hidden
        className="absolute -top-1/2 left-1/2 aspect-square w-[110%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_26%,transparent),transparent)]"
      />
      {phones.map(([slot, src]) => (
        <div
          key={slot}
          className={cn(
            "absolute aspect-[9/19.5] rounded-[5.5cqw] p-[1.1cqw] shadow-[0_18px_36px_-16px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-out",
            mockupSlots[slot],
          )}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[4.5cqw] bg-bg">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 12vw, 34vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
