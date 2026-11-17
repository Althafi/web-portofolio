import { cn } from "@/lib/utils";

/** 1120px content width with responsive side padding. */
export function Container({
  className,
  as: Tag = "div",
  ...props
}: React.ComponentProps<"div"> & {
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
}) {
  return <Tag className={cn("mx-auto w-full max-w-[1184px] px-5 sm:px-8", className)} {...props} />;
}
