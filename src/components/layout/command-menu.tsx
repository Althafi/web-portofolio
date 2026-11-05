"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { mailto, profile } from "@/lib/profile";
import { categoryLabels, type Category } from "@/lib/project-types";

export type CommandProject = {
  slug: string;
  title: string;
  category: Category;
  stack: string[];
};

type Ctx = { open: () => void };
const CommandMenuContext = createContext<Ctx>({ open: () => {} });

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}

const categoryIcon: Record<Category, typeof Smartphone> = {
  mobile: Smartphone,
  web: Laptop,
  tools: Terminal,
};

export function CommandMenuProvider({
  projects,
  children,
}: {
  projects: CommandProject[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const copyEmail = useCopyEmail();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const ctx = useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <CommandMenuContext.Provider value={ctx}>
      {children}
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
              <CommandItem
                onSelect={() => run(() => (window.location.href = mailto))}
              >
                <ArrowRight /> Kirim email
              </CommandItem>
              <CommandItem
                onSelect={() => run(() => window.open(profile.cv, "_blank"))}
              >
                <FileDown /> Unduh CV
              </CommandItem>
              {profile.socials.map((s) => (
                <CommandItem
                  key={s.label}
                  onSelect={() =>
                    run(() => window.open(s.href, "_blank", "noopener"))
                  }
                >
                  <ArrowRight /> Buka {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandMenuContext.Provider>
  );
}
