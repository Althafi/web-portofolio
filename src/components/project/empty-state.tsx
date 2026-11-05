import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  badge?: string;
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ badge = "Segera", title, description, className }: Props) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <Badge>{badge}</Badge>
      <p className="text-h4 text-fg">{title}</p>
      <p className="max-w-[600px] text-[15px] text-muted">{description}</p>
    </div>
  );
}
