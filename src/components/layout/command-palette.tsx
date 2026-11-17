"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  Copy,
  FileText,
  FolderGit2,
  Home,
  Laptop,
  Moon,
  Smartphone,
  Sun,
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
};

/** ⌘K command palette content — lazy-loaded on first open. */
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
      description="Search pages, projects, or commands"
      className="sm:max-w-[560px]"
    >
      <Command loop>
        <CommandInput placeholder="Type a command or search projects…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => run(() => router.push("/"))}>
              <Home /> Home
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/projects"))}>
              <FolderGit2 /> Projects
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/about"))}>
              <User /> About
            </CommandItem>
            <CommandItem onSelect={() => run(() => router.push("/#contact"))}>
              <AtSign /> Contact
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Projects">
            {projects.map((p) => {
              const Icon = categoryIcon[p.category];
              return (
                <CommandItem
                  key={p.slug}
                  value={`${p.title} ${p.category} ${p.stack.join(" ")}`}
                  onSelect={() => run(() => router.push(`/projects/${p.slug}`))}
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
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => run(() => setTheme("light"))}>
              <Sun /> Light theme
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("dark"))}>
              <Moon /> Dark theme
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("system"))}>
              <Laptop /> Use system setting
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(copyEmail)}>
              <Copy /> Copy email
              <CommandShortcut className="font-mono text-[11px] tracking-normal">
                {profile.email}
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => run(() => (window.location.href = mailto))}>
              <ArrowRight /> Send email
            </CommandItem>
            <CommandItem onSelect={() => run(() => window.open(profile.cv, "_blank"))}>
              <FileText /> View CV
            </CommandItem>
            {profile.socials.map((s) => (
              <CommandItem
                key={s.label}
                onSelect={() => run(() => window.open(s.href, "_blank", "noopener"))}
              >
                <ArrowRight /> Open {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
