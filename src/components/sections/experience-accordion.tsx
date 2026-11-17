"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Briefcase, ChevronDown, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experience } from "@/lib/profile";

type Props = {
  items: readonly Experience[];
  /** CV link: role details live there, not on the site. */
  cvHref: string;
  defaultOpen?: boolean;
};

/** Company logo tile; falls back to a generic icon when no logo is set. */
function LogoTile({ item, className }: { item: Experience; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-border bg-surface text-muted",
        className,
      )}
    >
      {item.logo ? (
        <Image src={item.logo} alt="" fill sizes="40px" className="object-contain p-1.5" />
      ) : (
        <Code2 className="size-5" />
      )}
    </span>
  );
}

/** Collapsed card → expands into a short list of roles (logo, role, company). */
export function ExperienceAccordion({ items, cvHref, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_24px_-16px_rgb(0_0_0/0.25)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-bg/60 focus-visible:outline-offset-[-2px]"
      >
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent"
        >
          <Briefcase className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold text-fg">Work Experience</span>
          <span className="block text-sm text-muted">View all my working experience</span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-5 shrink-0 text-muted transition-transform duration-300 ease-out group-hover:text-fg",
            open && "rotate-180",
          )}
        />
      </button>

      {/* grid-rows 0fr → 1fr animates height without measuring */}
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <ol className="border-t border-border">
            {items.map((item, i) => (
              <li
                key={`${item.period}-${item.role}`}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 transition-[opacity,transform] duration-300 ease-out",
                  open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                )}
                style={{ transitionDelay: open ? `${60 + i * 50}ms` : "0ms" }}
              >
                <LogoTile item={item} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-fg">{item.role}</p>
                  <p className="text-sm text-muted">
                    {item.place} · {item.type}
                  </p>
                </div>
                <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">
                  {item.period}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-border px-5 py-3.5">
            <a
              href={cvHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
            >
              Scope of work in my CV <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
