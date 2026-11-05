import { cn } from "@/lib/utils";

/** Badge kategori: latar accent-soft, teks accent, mono 11 kapital. */
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
