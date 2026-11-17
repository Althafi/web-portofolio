import { PageTransition } from "@/components/layout/page-transition";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { StatusPill } from "@/components/ui/status-pill";
import { TechIcon } from "@/components/ui/tech-icon";
import { AvatarCard } from "@/components/sections/avatar-card";
import { ExperienceList } from "@/components/sections/experience";
import { ContactCta } from "@/components/sections/contact-cta";
import { mailto, profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: `About ${profile.name}: ${profile.role} building mobile and web apps.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <Container className="pt-14">
        {/* Bio + photo */}
        <section className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-20">
          <div>
            <h1 className="text-title text-fg">About</h1>
            {profile.available && (
              <StatusPill tone="live" size="md" pulse className="mt-5">
                {profile.availability}
              </StatusPill>
            )}
            <div className="mt-6 max-w-[640px] space-y-4">
              {profile.about.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-lead text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Button asChild variant="primary" size="md">
                <a href={mailto}>
                  Send email <ArrowRight className="size-4" aria-hidden />
                </a>
              </Button>
              <Button asChild variant="secondary" size="md">
                <a href={profile.cv} target="_blank" rel="noreferrer">
                  View CV
                </a>
              </Button>
            </div>
          </div>
          <AvatarCard className="mx-auto w-full max-w-[340px] lg:mx-0" />
        </section>

        {/* Tech stack by group */}
        <section aria-labelledby="tech-stack" className="mt-[92px]">
          <h2 id="tech-stack" className="text-h2 text-fg">
            Tech stack
          </h2>
          <p className="mt-1.5 text-base text-muted">The tools I reach for most.</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {profile.techStack.map((group) => (
              <li key={group.label} className="rounded-[14px] border border-border bg-surface p-5">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold text-fg">{group.label}</h3>
                  {"badge" in group && group.badge ? (
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted">
                      {group.badge}
                    </span>
                  ) : null}
                </div>
                {group.items.length > 0 && (
                  <ul className="mt-3.5 flex flex-wrap gap-1.5">
                    {group.items.map((tech) => (
                      <li key={tech}>
                        <Chip variant="card" className="gap-1.5">
                          <TechIcon name={tech} />
                          {tech}
                        </Chip>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Experience timeline */}
        <section
          aria-labelledby="experience"
          className="mt-[92px] grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-0"
        >
          <div>
            <h2 id="experience" className="text-h2 text-fg">
              Experience
            </h2>
            <p className="mt-1.5 max-w-[300px] text-base text-muted">
              Where I&apos;ve learned, worked, and shipped products.
            </p>
          </div>
          <ExperienceList defaultOpen />
        </section>
      </Container>
      <ContactCta />
    </PageTransition>
  );
}
