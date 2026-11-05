import { PageTransition } from "@/components/layout/page-transition";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { StatusPill } from "@/components/ui/status-pill";
import { AvatarCard } from "@/components/sections/avatar-card";
import { ExperienceList } from "@/components/sections/experience";
import { ContactCta } from "@/components/sections/contact-cta";
import { mailto, profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Tentang",
  description: `Tentang ${profile.name}: ${profile.role} yang membangun aplikasi mobile, web, dan tools CLI.`,
  alternates: { canonical: "/tentang" },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <Container className="pt-14">
        {/* Bio + foto */}
        <section className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-20">
          <div>
            <h1 className="text-title text-fg">Tentang</h1>
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
                  Kirim email <ArrowRight className="size-4" aria-hidden />
                </a>
              </Button>
              <Button asChild variant="secondary" size="md">
                <a href={profile.cv} download>
                  Unduh CV
                </a>
              </Button>
            </div>
          </div>
          <AvatarCard className="mx-auto w-full max-w-[340px] lg:mx-0" />
        </section>

        {/* Tech stack per kelompok */}
        <section aria-labelledby="tech-stack" className="mt-[92px]">
          <h2 id="tech-stack" className="text-h2 text-fg">
            Tech stack
          </h2>
          <p className="mt-1.5 text-base text-muted">Alat yang paling sering saya pakai.</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {profile.techStack.map((group) => (
              <li key={group.label} className="rounded-[14px] border border-border bg-surface p-5">
                <h3 className="text-[15px] font-semibold text-fg">{group.label}</h3>
                <ul className="mt-3.5 flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <li key={tech}>
                      <Chip variant="card">{tech}</Chip>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline pengalaman */}
        <section
          aria-labelledby="pengalaman"
          className="mt-[92px] grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-0"
        >
          <div>
            <h2 id="pengalaman" className="text-h2 text-fg">
              Pengalaman
            </h2>
            <p className="mt-1.5 max-w-[300px] text-base text-muted">
              Tempat saya belajar, bekerja, dan merilis produk.
            </p>
          </div>
          <ExperienceList />
        </section>
      </Container>
      <ContactCta />
    </PageTransition>
  );
}
