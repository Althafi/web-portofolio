import { Container } from "@/components/layout/container";
import { Chip } from "@/components/ui/chip";
import { TechIcon } from "@/components/ui/tech-icon";
import { Marquee } from "@/components/effects/marquee";
import { homeTech } from "@/lib/profile";

export function TechStack() {
  return (
    <section aria-labelledby="tech-stack-label" className="border-y border-border bg-bg">
      <Container className="flex h-[72px] items-center gap-8 sm:gap-12">
        <h2 id="tech-stack-label" className="shrink-0 font-mono text-xs font-medium text-muted">
          TECH STACK
        </h2>
        <Marquee label="Technologies I use" className="flex-1">
          {homeTech.map((tech) => (
            <li key={tech}>
              <Chip variant="solid" className="gap-2">
                <TechIcon name={tech} className="size-4" />
                {tech}
              </Chip>
            </li>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
