import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  id?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ title, description, action, className, id, as: Tag = "h2" }: Props) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-6">
        <Tag id={id} className="text-h2 text-fg">
          {title}
        </Tag>
        {action ? (
          <Link
            href={action.href}
            className="shrink-0 text-sm font-medium text-fg underline-offset-4 hover:underline"
          >
            {action.label}
            <span aria-hidden>&nbsp;&nbsp;→</span>
          </Link>
        ) : null}
      </div>
      {description ? <p className="text-base text-muted">{description}</p> : null}
    </div>
  );
}
