import { cn } from "@/lib/utils";

/** Category badge: accent-soft background, accent text, mono 11 uppercase. */
export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-md bg-accent-soft px-2 font-mono text-[11px] font-medium uppercase leading-none text-accent",
        className,
      )}
      {...props}
    />
  );
}
