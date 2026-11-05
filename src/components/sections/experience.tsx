import { Container } from "@/components/layout/container";
import { profile } from "@/lib/profile";

export function ExperienceSection() {
  return (
    <section aria-labelledby="pengalaman" className="pt-[92px]">
      <Container className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-0">
        <div>
          <h2 id="pengalaman" className="text-h2 text-fg">
            Pengalaman
          </h2>
          <p className="mt-1.5 max-w-[300px] text-base text-muted">
            Tempat saya belajar, bekerja, dan merilis produk.
          </p>
        </div>
        <ExperienceList />
      </Container>
    </section>
  );
}

export function ExperienceList() {
  return (
    <ol className="border-t border-border">
      {profile.experience.map((item) => (
        <li
          key={`${item.period}-${item.role}`}
          className="grid grid-cols-1 gap-1 border-b border-border py-5 sm:grid-cols-[160px_1fr_auto] sm:items-center sm:gap-6"
        >
          <span className="font-mono text-[13px] text-muted">{item.period}</span>
          <div>
            <p className="text-lg font-medium text-fg">{item.role}</p>
            <p className="mt-1 text-[15px] text-muted">{item.place}</p>
          </div>
          <span className="text-sm text-muted">{item.type}</span>
        </li>
      ))}
    </ol>
  );
}
