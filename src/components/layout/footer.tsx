import { Container } from "@/components/layout/container";
import { mailto, profile } from "@/lib/profile";

export function Footer() {
  const links = [...profile.socials, { label: "Email", short: "@", href: mailto }];

  return (
    <footer>
      <Container>
        <div className="flex flex-col gap-4 border-t border-border pt-[30px] pb-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {profile.name}. Dibangun dengan Next.js, Tailwind &amp; Motion.</p>
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="transition-colors hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
