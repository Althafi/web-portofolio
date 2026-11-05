import { cn } from "@/lib/utils";
import type { Project } from "@/lib/project-types";

/** Posisi HP dibuat bervariasi per kartu, seperti di desain. */
const phonePlacement = [
  "left-1/2 top-7 -translate-x-1/2", // tengah (Kasirku)
  "left-20 top-10", // kiri (Ritme)
  "right-[93px] top-9", // kanan (Jalur)
] as const;

export function PhoneMock({ variant = 0, className }: { variant?: number; className?: string }) {
  const big = variant % 2 === 1;
  return (
    <div
      aria-hidden
      className={cn("absolute h-[230px] w-[114px] rounded-[22px] bg-fg p-[5px]", className)}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-bg">
        <span className="absolute top-[22px] left-2.5 h-1.5 w-[50px] rounded-[3px] bg-muted" />
        <span className="absolute top-[34px] left-2.5 h-3 w-[74px] rounded-[3px] bg-fg" />
        <span
          className={cn(
            "absolute top-14 left-2.5 w-[84px] bg-accent",
            big ? "h-[84px] rounded-[22px]" : "h-11 rounded-lg",
          )}
        />
        {!big && (
          <>
            <span className="absolute top-[108px] left-2.5 size-10 rounded-lg bg-surface" />
            <span className="absolute top-[108px] left-[54px] size-10 rounded-lg bg-surface" />
          </>
        )}
        <span className="absolute top-[156px] left-2.5 h-10 w-[84px] rounded-lg bg-surface" />
      </div>
    </div>
  );
}

export function TerminalMock({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute top-[30px] right-7 left-7 h-[200px] rounded-[10px] border border-border bg-[#09090b] px-3.5 pt-3",
        className,
      )}
    >
      <div aria-hidden className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-[#3f3f46]" />
        ))}
      </div>
      <pre className="mt-3.5 font-mono text-[11px] leading-[1.6] whitespace-pre text-[#d4d4d8]">
        {lines.join("\n")}
        {"\n$ "}
        <span aria-hidden className="animate-pulse">
          █
        </span>
      </pre>
    </div>
  );
}

/** Ilustrasi di bagian atas kartu: HP untuk mobile/web, terminal untuk tools. */
export function ProjectThumb({ project }: { project: Project }) {
  if (project.category === "tools") {
    return <TerminalMock lines={project.terminal ?? [`$ ${project.slug} --help`]} />;
  }
  const variant = (project.order - 1) % phonePlacement.length;
  return <PhoneMock variant={variant} className={phonePlacement[variant]} />;
}
