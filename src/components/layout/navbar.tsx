"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { isActive, navLinks } from "@/components/layout/nav-links";
import { useCommandMenu } from "@/components/layout/command-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const commandMenu = useCommandMenu();
  const [scrolled, setScrolled] = useState(false);
  // Mobile menu closes automatically on navigation (tied to pathname)
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuOpen = menuFor === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // (08) Navbar sticks with a blur once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: focus the first link, Esc closes & restores focus
  useEffect(() => {
    if (!menuOpen) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuFor(null);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border transition-[background-color,backdrop-filter] duration-300",
        scrolled || menuOpen ? "bg-bg/80 backdrop-blur-md backdrop-saturate-150" : "bg-bg",
      )}
      style={{ viewTransitionName: "site-header" }}
    >
      <Container className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Logo className="justify-self-start" />

        <nav aria-label="Main navigation" className="hidden lg:block">
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

        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          <button
            type="button"
            onClick={commandMenu.open}
            aria-haspopup="dialog"
            aria-label="Search (⌘K)"
            className="hidden h-9 w-[172px] items-center justify-between rounded-lg border border-border pr-[7px] pl-3 text-sm text-muted transition-colors hover:text-fg sm:flex"
          >
            Search…
            <kbd className="grid h-[22px] place-items-center rounded-[5px] bg-surface px-[7px] font-mono text-[11px] font-medium text-muted">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={commandMenu.open}
            aria-haspopup="dialog"
            aria-label="Search"
            className="grid size-9 place-items-center rounded-lg border border-border text-fg sm:hidden"
          >
            <Search className="size-4" aria-hidden />
          </button>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuFor(menuOpen ? null : pathname)}
            className="grid size-9 place-items-center rounded-lg border border-border text-fg lg:hidden"
          >
            {menuOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        ref={panelRef}
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-border lg:hidden"
      >
        <nav aria-label="Mobile navigation">
          <Container className="py-3">
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuFor(null)}
                      className={cn(
                        "flex h-12 items-center rounded-lg px-3 text-base font-medium",
                        active ? "bg-surface text-fg" : "text-muted",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </nav>
      </div>
    </header>
  );
}
