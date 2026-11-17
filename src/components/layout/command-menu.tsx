"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Category } from "@/lib/project-types";

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

// (8.3) cmdk + dialog are only downloaded when the palette is first opened
const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

export function CommandMenuProvider({
  projects,
  children,
}: {
  projects: CommandProject[];
  children: React.ReactNode;
}) {
  const [open, setOpenState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const setOpen = useCallback((next: boolean) => {
    if (next) setLoaded(true);
    setOpenState(next);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpenState((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const ctx = useMemo(() => ({ open: () => setOpen(true) }), [setOpen]);

  return (
    <CommandMenuContext.Provider value={ctx}>
      {children}
      {loaded && <CommandPalette open={open} setOpen={setOpen} projects={projects} />}
    </CommandMenuContext.Provider>
  );
}
