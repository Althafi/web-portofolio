import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  categories,
  slugify,
  statuses,
  type Category,
  type CategoryCounts,
  type Project,
} from "@/lib/project-types";

export type { CategoryCounts };

/**
 * Project data source: MDX files in `src/content/projects/`.
 * The frontmatter holds the data; the MDX body holds the case study.
 * Read synchronously so it finishes during prerender (build).
 */
const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

function fail(file: string, message: string): never {
  throw new Error(`[projects] ${file}: ${message}`);
}

function parseProject(file: string): Project {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  if (!data.title) fail(file, "`title` is required");
  if (!categories.includes(data.category)) {
    fail(file, `\`category\` must be one of ${categories.join(", ")}`);
  }
  if (!statuses.includes(data.status)) {
    fail(file, `\`status\` must be one of ${statuses.join(", ")}`);
  }

  if (data.cover && !Array.isArray(data.cover.screens)) {
    fail(file, "`cover.screens` must be a list of image paths");
  }

  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
    id: slugify(m[1]),
    title: m[1].trim(),
  }));

  return {
    slug,
    title: String(data.title),
    category: data.category,
    kind: data.kind,
    summary: data.summary ?? "",
    tagline: data.tagline ?? data.summary ?? "",
    stack: data.stack ?? [],
    role: data.role ?? "",
    duration: data.duration ?? "",
    platform: data.platform ?? "",
    year: Number(data.year),
    status: data.status,
    statusNote: data.statusNote ? String(data.statusNote) : undefined,
    logo: data.logo,
    releaseTarget: data.releaseTarget ? String(data.releaseTarget) : undefined,
    progress: typeof data.progress === "number" ? data.progress : undefined,
    links: data.links ?? {},
    demo: data.demo ? { chapters: [], ...data.demo } : undefined,
    stats: data.stats,
    highlights: data.highlights ?? [],
    roadmap: data.roadmap,
    showcase: data.showcase,
    cover: data.cover,
    gallery: data.gallery,
    featured: Boolean(data.featured),
    order: typeof data.order === "number" ? data.order : 99,
    headings,
  };
}

let cache: Project[] | null = null;

export function getAllProjects(): Project[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parseProject)
    .sort((a, b) => a.order - b.order || b.year - a.year);
  return cache;
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectsByCategory(): Record<Category, Project[]> {
  const all = getAllProjects();
  return Object.fromEntries(
    categories.map((c) => [c, all.filter((p) => p.category === c)]),
  ) as Record<Category, Project[]>;
}

export function getCategoryCounts(all: Project[] = getAllProjects()): CategoryCounts {
  return {
    all: all.length,
    mobile: all.filter((p) => p.category === "mobile").length,
    web: all.filter((p) => p.category === "web").length,
  };
}

/** Other projects for the "More projects" section on the detail page. */
export function getOtherProjects(slug: string, limit = 2): Project[] {
  return getAllProjects()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, limit);
}

/** Case study content component (the MDX below the frontmatter). */
export async function loadProjectContent(slug: string) {
  const mod = await import(`@/content/projects/${slug}.mdx`);
  return mod.default as React.ComponentType;
}
