import { Container } from "@/components/layout/container";
import { ExperienceAccordion } from "@/components/sections/experience-accordion";
import { profile } from "@/lib/profile";

export function ExperienceSection() {
  return (
    <section aria-labelledby="experience" className="pt-[92px]">
      <Container className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-0">
        <div>
          <h2 id="experience" className="text-h2 text-fg">
            Experience
          </h2>
          <p className="mt-1.5 max-w-[300px] text-base text-muted">
            Where I&apos;ve learned, worked, and shipped products.
          </p>
        </div>
        <ExperienceList />
      </Container>
    </section>
  );
}

export function ExperienceList({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <ExperienceAccordion
      items={profile.experience}
      cvHref={profile.cv}
      defaultOpen={defaultOpen}
    />
  );
}
