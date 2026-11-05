"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** (11) Daftar isi yang menandai bagian yang sedang dibaca. */
export function ActiveToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // Bagian aktif = judul terakhir yang sudah melewati 30% atas layar
        const passed = headings.filter(
          (h) => h.getBoundingClientRect().top < window.innerHeight * 0.3,
        );
        const current = passed.at(-1) ?? headings[0];
        setActive(current.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => observer.observe(h));

    // Sampai di dasar halaman → tandai bagian terakhir
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(headings.at(-1)!.id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="Di halaman ini" className="relative border-l border-border py-1 pl-4">
      <p className="text-label text-muted">Di halaman ini</p>
      <ul className="mt-2.5 space-y-2.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-marker"
                  aria-hidden
                  className="absolute top-0 -left-[17px] h-full w-0.5 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block text-sm transition-colors",
                  isActive ? "font-medium text-accent" : "text-muted hover:text-fg",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
