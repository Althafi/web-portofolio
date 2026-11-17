import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project, ProjectCover } from "@/lib/project-types";

/** Phone position varies per card, as in the design. */
const phonePlacement = [
  "left-1/2 top-7 -translate-x-1/2", // center (1st card)
  "left-20 top-10", // left (2nd card)
  "right-[93px] top-9", // right (3rd card)
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

/** Illustration at the top of the card: a brand cover if there are screens, else a phone mock. */
export function ProjectThumb({ project }: { project: Project }) {
  const cover =
    project.cover ??
    (project.showcase?.screens?.length ? { screens: project.showcase.screens } : undefined);
  if (cover?.screens?.length) {
    return <BrandCover cover={{ logo: project.logo, ...cover }} name={project.title} />;
  }
  const variant = (project.order - 1) % phonePlacement.length;
  return <PhoneMock variant={variant} className={phonePlacement[variant]} />;
}

/**
 * Presentation-style cover: logo, app name and tagline on the left; a main
 * phone plus two cropped phones on a brand-colored circle on the right.
 * Always dark, tinted with the app's brand color (falls back to the accent).
 */
function BrandCover({ cover, name }: { cover: ProjectCover; name: string }) {
  const [main, top, bottom] = cover.screens;
  const brand = cover.color ?? "var(--accent)";
  const style = {
    "--brand": brand,
    "--brand-2": cover.colorTo ?? brand,
  } as CSSProperties;

  return (
    <div
      aria-hidden
      style={style}
      className="absolute inset-0 overflow-hidden bg-[color-mix(in_oklab,var(--brand)_9%,#0c0c0e)]"
    >
      <span className="absolute top-1/2 -right-[64px] size-[264px] -translate-y-1/2 rounded-full bg-[linear-gradient(160deg,var(--brand),var(--brand-2))] opacity-90" />
      <span className="absolute -top-16 -left-16 size-48 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_22%,transparent),transparent)]" />

      <div className="absolute bottom-6 left-5 max-w-[42%]">
        {cover.logo && (
          <Image
            src={cover.logo}
            alt=""
            width={36}
            height={36}
            className="rounded-[10px] shadow-[0_6px_16px_-6px_rgb(0_0_0/0.6)]"
          />
        )}
        <p className="mt-3 text-[22px] leading-none font-semibold tracking-[-0.02em] text-white">
          {name}
        </p>
        {cover.tagline && (
          <p className="mt-1.5 text-xs leading-snug text-balance text-white/60">{cover.tagline}</p>
        )}
        <span className="mt-3.5 flex gap-1.5">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" />
          <span className="size-1.5 rounded-full border border-white/40" />
          <span className="size-1.5 rounded-full border border-white/40" />
        </span>
      </div>

      {top && <CoverPhone src={top} className="-top-[112px] -right-3 w-[84px]" />}
      {bottom && <CoverPhone src={bottom} className="top-[128px] -right-3 w-[84px]" />}
      {main && (
        <CoverPhone
          src={main}
          className="top-6 right-[86px] z-10 w-[96px] motion-safe:group-hover/card:-translate-y-1.5"
        />
      )}
    </div>
  );
}

function CoverPhone({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-[16px] bg-[#1f1f23] p-[3px] shadow-[0_18px_36px_-14px_rgb(0_0_0/0.7)] ring-1 ring-white/10 transition-transform duration-500 ease-out",
        className,
      )}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[13px] bg-bg">
        <Image src={src} alt="" fill sizes="96px" className="object-cover object-top" />
      </div>
    </div>
  );
}
