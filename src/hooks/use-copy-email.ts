"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { profile } from "@/lib/profile";

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Cadangan untuk browser/konteks tanpa Clipboard API
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

/** Salin email ke clipboard lalu tampilkan toast "Tersalin!". */
export function useCopyEmail() {
  return useCallback(async () => {
    try {
      await writeClipboard(profile.email);
      toast.success("Tersalin!", { description: profile.email });
    } catch {
      toast.error("Gagal menyalin", { description: `Salin manual: ${profile.email}` });
    }
  }, []);
}
