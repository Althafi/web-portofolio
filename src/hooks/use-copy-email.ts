"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { profile } from "@/lib/profile";

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for browsers/contexts without the Clipboard API
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  el.remove();
}

/** Copy the email to the clipboard, then show a "Copied!" toast. */
export function useCopyEmail() {
  return useCallback(async () => {
    try {
      await writeClipboard(profile.email);
      toast.success("Copied!", { description: profile.email });
    } catch {
      toast.error("Couldn't copy", { description: `Copy it manually: ${profile.email}` });
    }
  }, []);
}
