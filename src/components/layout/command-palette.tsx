"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  Copy,
  FileDown,
  FolderGit2,
  Home,
  Laptop,
  Moon,
  Smartphone,
  Sun,
  Terminal,
  User,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useCopyEmail } from "@/hooks/use-copy-email";
import { useThemeSwitch } from "@/hooks/use-theme-switch";
import { mailto, profile } from "@/lib/profile";
import { categoryLabels, type Category } from "@/lib/project-types";
import type { CommandProject } from "@/components/layout/command-menu";

const categoryIcon: Record<Category, typeof Smartphone> = {
  mobile: Smartphone,
  web: Laptop,
  tools: Terminal,
};

/** Isi command palette ⌘K — dimuat lazy saat pertama kali dibuka. */
export function CommandPalette({
  open,
  setOpen,
  projects,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  projects: CommandProject[];
}) {
  const router = useRouter();
  const setTheme = useThemeSwitch();
  const copyEmail = useCopyEmail();

  const run = useCallback(
    (fn: () => void) => {
      setOpen(false);
      fn();
    },
    [setOpen],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Cari halaman, proyek, atau perintah"
      className="sm:max-w-[560px]"
    >
      <Command loop>
        <CommandInput placeholder="Ketik perintah atau cari proyek…" />
        <CommandList>
          <CommandEmpty>Tidak ada hasil.</CommandEmpty>

          <CommandGroup heading="Navigasi">
            <CommandItem onSelect={() => run(() => router.push("/"))}>
              <Home /> Beranda
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/proyek"))}>
              <FolderGit2 /> Proyek
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/tentang"))}>
              <User /> Tentang
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/#kontak"))}>
              <AtSign /> Kontak
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Proyek">
            {projects.map((p) => {
              const Icon = categoryIcon[p.category];
              return (
                <CommandItem
                  key={p.slug}
                  value={`${p.title} ${p.category} ${p.stack.join(" ")}`}
                  onSelect={() => run(() => router.push(`/proyek/${p.slug}`))}
                >
                  <Icon /> {p.title}
                  <CommandShortcut className="font-mono text-[11px] tracking-normal">
                    {categoryLabels[p.category]}
                  </CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Tema">
            <CommandItem onSelect={() => run(() => setTheme("light"))}>
              <Sun /> Tema terang
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("dark"))}>
              <Moon /> Tema gelap
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("system"))}>
              <Laptop /> Ikuti sistem
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Aksi">
            <CommandItem onSelect={() => run(copyEmail)}>
              <Copy /> Salin email
              <CommandShortcut className="font-mono text-[11px] tracking-normal">
                {profile.email}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => run(() => (window.location.href = mailto))}>
              <ArrowRight /> Kirim email
            </CommandItem>
            <CommandItem onSelect={() => run(() => window.open(profile.cv, "_blank"))}>
              <FileDown /> Unduh CV
            </CommandItem>
            {profile.socials.map((s) => (
              <CommandItem
                key={s.label}
                onSelect={() => run(() => window.open(s.href, "_blank", "noopener"))}
              >
                <ArrowRight /> Buka {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
