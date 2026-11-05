import Link from "next/link";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/utils";

/** Bentuk blob logo: sudut kiri atas tajam, sisanya bulat. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block size-[22px] rounded-[3px_11px_11px_11px] bg-accent", className)}
    />
  );
}

/**
 * Logo navbar. `data-logo-*` menjadi titik pendaratan blob + nama dari preloader;
 * selama preloader berjalan (`html[data-preloading]`) logo ini disembunyikan.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${profile.handle} — ke beranda`}
      className={cn("flex items-center gap-2.5 rounded-md", className)}
    >
      <span data-logo-mark className="logo-part">
        <LogoMark />
      </span>
      <span
        data-logo-text
        className="logo-part block text-lg leading-none font-semibold tracking-[-0.02em] text-fg"
      >
        {profile.handle}
      </span>
    </Link>
  );
}
