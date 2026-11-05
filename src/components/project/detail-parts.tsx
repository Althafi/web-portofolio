import { Chip } from "@/components/ui/chip";
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

/* ---------- Showcase 3 HP ---------- */

function ShowcasePhone({
  className,
  children,
  center = false,
}: {
  className?: string;
  children?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute",
        center
          ? "h-[450px] w-[220px] rounded-[38px] bg-[#3f3f46] p-2"
          : "h-[410px] w-[200px] rounded-[34px] bg-[#27272a] p-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-bg",
          center ? "rounded-[30px]" : "rounded-[27px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Showcase({ project }: { project: Project }) {
  return (
    <div
      aria-hidden
      className="relative h-[420px] overflow-hidden rounded-[20px] border border-border bg-surface sm:h-[540px]"
    >
      <span className="absolute -top-[260px] left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_30%,transparent),transparent)]" />
      <div className="absolute inset-x-0 top-[60px] mx-auto h-full w-[580px] max-sm:origin-top max-sm:scale-[0.78]">
        <ShowcasePhone className="top-[62px] left-0 max-sm:hidden" />
        <ShowcasePhone className="top-[41px] right-0 max-sm:hidden" />
        <ShowcasePhone center className="top-0 left-1/2 -translate-x-1/2">
          {project.showcase && (
            <>
              <p className="absolute top-10 left-[18px] text-[11px] text-muted">{project.showcase.label}</p>
              <p className="absolute top-[58px] left-[18px] text-2xl font-semibold tracking-tight text-fg">
                {project.showcase.value}
              </p>
            </>
          )}
          <span className="absolute top-[104px] left-[18px] h-[90px] w-[168px] rounded-[14px] bg-accent" />
          <span className="absolute top-[206px] left-[18px] size-20 rounded-[14px] bg-surface" />
          <span className="absolute top-[206px] left-[106px] size-20 rounded-[14px] bg-surface" />
          <span className="absolute top-[298px] left-[18px] h-[110px] w-[168px] rounded-[14px] bg-surface" />
        </ShowcasePhone>
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */

export function TableOfContents({
  items,
  activeId,
}: {
  items: { id: string; title: string }[];
  activeId?: string;
}) {
  return (
    <nav aria-label="Di halaman ini" className="border-l border-border py-1 pl-4">
      <p className="text-label text-muted">Di halaman ini</p>
      <ul className="mt-2.5 space-y-2.5">
        {items.map((item, i) => {
          const active = activeId ? activeId === item.id : i === 0;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "block text-sm transition-colors",
                  active ? "font-medium text-accent" : "text-muted hover:text-fg",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

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
      <div
        role="progressbar"
        aria-label="Progres menuju rilis"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-3.5 h-1.5 overflow-hidden rounded-[3px] bg-border"
      >
        <div
          data-progress-bar
          className="h-full origin-left rounded-[3px] bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>
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

export function Gallery({ title }: { title: string }) {
  return (
    <section aria-labelledby="galeri">
      <h2 id="galeri" className="scroll-mt-24 text-h3 text-fg">
        Galeri
      </h2>
      <ul className="mt-[17px] grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className="grid aspect-[357/240] place-items-center rounded-[14px] border border-border bg-surface"
          >
            <span className="font-mono text-[11px] text-muted">
              {title} · screenshot {n}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
