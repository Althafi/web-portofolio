import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { LocalTime } from "@/components/sections/local-time";
import { mailto, profile } from "@/lib/profile";
import type { CategoryCounts } from "@/lib/project-types";

function statsLine(counts: CategoryCounts) {
  const parts = [
    counts.mobile ? `${counts.mobile} mobile` : null,
    counts.web ? `${counts.web} web` : null,
    counts.tools ? `${counts.tools} CLI` : null,
  ].filter(Boolean);
  if (!counts.web) parts.push("web segera");
  return parts.join(" · ");
}

export function Hero({ counts }: { counts: CategoryCounts }) {
  const socials = [...profile.socials, { label: "Email", short: "@", href: mailto }];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <Container className="relative grid items-center gap-14 pt-16 pb-20 lg:grid-cols-[1fr_340px] lg:gap-10 lg:pt-28 lg:pb-32">
        <div className="max-w-[720px]">
          {profile.available && (
            <StatusPill tone="live" size="md" pulse>
              {profile.availability}
            </StatusPill>
          )}
          <h1 id="hero-title" className="mt-[22px] text-display text-fg">
            {profile.headline}
          </h1>
          <p className="mt-[18px] max-w-[560px] text-lead text-muted">{profile.bio}</p>

          <div className="mt-[29px] flex flex-wrap items-center gap-2.5">
            <Button asChild variant="primary" size="md">
              <Link href="/proyek">
                Lihat proyek <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="md">
              <a href={profile.cv} download>
                Unduh CV
              </a>
            </Button>
            <span aria-hidden className="mx-0.5 h-6 w-px bg-border" />
            {socials.map((s) => (
              <Button key={s.label} asChild variant="secondary" size="icon-md">
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="font-mono text-[13px] font-semibold"
                >
                  {s.short}
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Kartu avatar + chip mengambang */}
        <div className="relative mx-auto w-full max-w-[340px] lg:mx-0">
          <div className="relative aspect-[340/420] overflow-hidden rounded-[20px] border border-border bg-surface">
            <span className="absolute top-[18px] left-5 font-mono text-[11px] text-muted">FOTO</span>
            <span aria-hidden className="absolute top-[28.5%] left-1/2 size-[35%] -translate-x-1/2 rounded-full bg-border" />
            <span aria-hidden className="absolute top-[62%] left-1/2 h-[48%] w-[65%] -translate-x-1/2 rounded-t-[110px] bg-border" />
            <span className="sr-only">Foto {profile.name}</span>
          </div>

          <div className="absolute -top-6 -right-2 flex h-8 items-center rounded-2xl border border-border bg-bg px-3 font-mono text-xs text-fg shadow-[0_8px_24px_rgb(0_0_0/0.1)] sm:-right-8">
            {profile.location} ·&nbsp;
            <LocalTime />
          </div>

          <div className="absolute bottom-3.5 -left-3 w-[200px] rounded-[14px] border border-border bg-bg px-4 py-3 shadow-[0_8px_24px_rgb(0_0_0/0.1)] sm:-left-12">
            <p className="text-base font-semibold text-fg">{counts.all} proyek dibangun</p>
            <p className="mt-0.5 text-[13px] text-muted">{statsLine(counts)}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
