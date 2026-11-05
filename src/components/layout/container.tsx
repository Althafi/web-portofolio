import { cn } from "@/lib/utils";

/** Lebar konten 1120px dengan padding samping responsif. */
export function Container({
  className,
  as: Tag = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: "div" | "section" | "header" | "footer" | "main" | "nav" }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1184px] px-5 sm:px-8", className)}
      {...props}
    />
  );
}
