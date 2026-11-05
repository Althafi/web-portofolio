import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  id?: string;
};

export function SectionHeading({ title, description, action, className, id }: Props) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="space-y-1.5">
        <h2 id={id} className="text-h2 text-fg">
          {title}
        </h2>
        {description ? <p className="text-base text-muted">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="mb-1 shrink-0 text-sm font-medium text-fg underline-offset-4 hover:underline"
        >
          {action.label}
          <span aria-hidden>&nbsp;&nbsp;→</span>
        </Link>
      ) : null}
    </div>
  );
}
