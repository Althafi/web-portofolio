import Link from "next/link";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";

/**
 * Logo mark: a blinking terminal block cursor after the name — "always building".
 * Ties into the terminal (`>_`) theme and the preloader, where this cursor types the name.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("caret block h-[1em] w-[0.5em] rounded-[2px] bg-accent", className)}
    />
  );
}

/**
 * Navbar logo: `Althafi Hilal Anshar▌`. `data-logo-*` are the landing targets for the preloader's name + cursor;
 * while the preloader runs (`html[data-preloading]`) this logo is hidden.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${profile.handle} — go to home`}
      className={cn(
        "flex items-center gap-[0.18em] rounded-md text-base whitespace-nowrap lg:text-lg",
        className,
      )}
    >
      <span
        data-logo-text
        className="logo-part block leading-none font-semibold tracking-[-0.02em] text-fg"
      >
        {profile.handle}
      </span>
      <span data-logo-mark className="logo-part">
        <LogoMark />
      </span>
    </Link>
  );
}
