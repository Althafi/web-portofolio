import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva("inline-flex shrink-0 items-center whitespace-nowrap leading-none", {
  variants: {
    variant: {
      /** Stack chip on project cards */
      outline: "h-6 rounded-md border border-border px-2 font-mono text-[11px] text-muted",
      /** Tech stack chip on the home page */
      solid: "h-[34px] rounded-lg bg-surface px-3 text-sm font-medium text-fg",
      /** Chip in the detail page tech stack card */
      card: "h-7 rounded-[7px] border border-border bg-bg px-2.5 text-[13px] font-medium text-fg",
    },
  },
  defaultVariants: { variant: "outline" },
});

export function Chip({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return <span className={cn(chipVariants({ variant }), className)} {...props} />;
}
