import { cn } from "@/lib/utils";

/**
 * (04) Endless marquee (CSS) that pauses on hover/focus.
 * The list is duplicated for a seamless loop; the second copy is hidden from screen readers.
 */
export function Marquee({
  children,
  className,
  duration = 40,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  label: string;
}) {
  return (
    <div
      className={cn(
        "marquee relative min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]",
        className,
      )}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className="marquee-track flex w-max">
        <ul aria-label={label} className="flex shrink-0 gap-2 pr-2">
          {children}
        </ul>
        <ul aria-hidden className="flex shrink-0 gap-2 pr-2">
          {children}
        </ul>
      </div>
    </div>
  );
}
