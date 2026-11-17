import { cn } from "@/lib/utils";
import { brandTone, getTechLogo } from "@/lib/tech-icons";

/** Logo for a tech name; falls back to a monogram tile when no logo is mapped. */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const logo = getTechLogo(name);
  const size = cn("size-3.5 shrink-0", className);

  if (!logo) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-[4px] bg-border font-mono text-[9px] font-semibold leading-none text-fg",
          size,
        )}
      >
        {name.replace(/[^A-Za-z0-9]/g, "").charAt(0).toUpperCase()}
      </span>
    );
  }

  if (logo.kind === "image") {
    // Tiny static logo: next/image adds nothing here.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo.src} alt="" aria-hidden className={cn("object-contain", size)} />;
  }

  const tone = brandTone(logo.icon.hex);
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn(size, tone === "dim" && "dark:brightness-[1.8]")}
      fill={tone === "ink" ? "currentColor" : `#${logo.icon.hex}`}
    >
      <path d={logo.icon.path} />
    </svg>
  );
}
