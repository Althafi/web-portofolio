import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"span"> & {
  /** `live` = green (available/released), `progress` = amber (beta, development, prototype) */
  tone?: "live" | "progress";
  size?: "sm" | "md";
  /** Pulsing dot (enabled in Phase 6) */
  pulse?: boolean;
};

export function StatusPill({
  tone = "progress",
  size = "sm",
  pulse = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-bg font-medium whitespace-nowrap text-fg",
        size === "sm"
          ? "h-6 gap-1.5 pr-2.5 pl-2 text-[11px]"
          : "h-[30px] gap-2 pr-3 pl-2.5 text-[13px]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-pulse={pulse || undefined}
        className={cn(
          "status-dot relative shrink-0 rounded-full",
          size === "sm" ? "size-1.5" : "size-2",
          tone === "live"
            ? "bg-status-live text-status-live"
            : "bg-status-progress text-status-progress",
        )}
      />
      {children}
    </span>
  );
}
