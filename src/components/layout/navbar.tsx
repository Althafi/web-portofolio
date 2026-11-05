"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { isActive, navLinks } from "@/components/layout/nav-links";
import { useCommandMenu } from "@/components/layout/command-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const commandMenu = useCommandMenu();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-bg">
      <Container className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Logo className="justify-self-start" />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors",
                      active ? "bg-surface text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <button
            type="button"
            onClick={commandMenu.open}
            aria-haspopup="dialog"
            aria-label="Cari (⌘K)"
            className="hidden h-9 w-[172px] items-center justify-between rounded-lg border border-border pr-[7px] pl-3 text-sm text-muted transition-colors hover:text-fg sm:flex"
          >
            Cari…
            <kbd className="grid h-[22px] place-items-center rounded-[5px] bg-surface px-[7px] font-mono text-[11px] font-medium text-muted">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
