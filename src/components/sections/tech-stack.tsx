import { Container } from "@/components/layout/container";
import { Chip } from "@/components/ui/chip";
import { allTech } from "@/lib/profile";

export function TechStack() {
  return (
    <section aria-label="Tech stack" className="border-y border-border bg-bg">
      <Container className="flex h-[72px] items-center gap-12">
        <h2 className="shrink-0 font-mono text-xs font-medium text-muted">TECH STACK</h2>
        <ul className="flex min-w-0 gap-2 overflow-hidden">
          {allTech.map((tech) => (
            <li key={tech}>
              <Chip variant="solid">{tech}</Chip>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
