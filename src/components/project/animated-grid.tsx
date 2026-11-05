"use client";

import { AnimatePresence, motion } from "motion/react";
import { ProjectCard } from "@/components/project/project-card";
import type { Project } from "@/lib/project-types";
import { cn } from "@/lib/utils";

/** (06) Grid kartu: kartu yang tersaring bergeser dengan animasi layout. */
export function AnimatedProjectGrid({
  projects,
  className,
}: {
  projects: Project[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {projects.map((project) => (
          <motion.li
            key={project.slug}
            layout
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <ProjectCard project={project} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
