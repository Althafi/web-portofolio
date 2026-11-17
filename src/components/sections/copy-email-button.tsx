"use client";

import { Button } from "@/components/ui/button";
import { useCopyEmail } from "@/hooks/use-copy-email";
import { profile } from "@/lib/profile";

export function CopyEmailButton() {
  const copy = useCopyEmail();
  return (
    <Button
      type="button"
      variant="ghost"
      size="md"
      onClick={copy}
      aria-label={`Copy email address ${profile.email}`}
      className="border-inverse-fg/80 font-mono text-sm font-normal text-inverse-fg hover:bg-inverse-fg/10 hover:text-inverse-fg dark:hover:bg-inverse-fg/10"
    >
      Copy: {profile.email}
    </Button>
  );
}
