/**
 * Project types & helpers that are safe to use in client components
 * (no file system access). The file reader lives in `lib/projects.ts`.
 */

export const categories = ["mobile", "web"] as const;
export type Category = (typeof categories)[number];

/** Categories shown on the home page. */
export const homeCategories: readonly Category[] = categories;

/** `developed` = finished, but not (yet) published to a store. */
export const statuses = ["released", "developed", "beta", "development", "prototype"] as const;
export type Status = (typeof statuses)[number];

export type ProjectLinks = {
  github?: string;
  playStore?: string;
  appStore?: string;
  apk?: string;
  live?: string;
};

export type DemoChapter = {
  /** Seconds from the start of the video */
  at: number;
  label: string;
};

export type ProjectDemo = {
  video?: string;
  poster?: string;
  chapters: DemoChapter[];
};

export type ProjectStat = { value: string; label: string };

/**
 * Presentation-style card cover. `screens` = [main, top-right, bottom-right];
 * `color`/`colorTo` = the app's brand gradient (default: site accent).
 */
export type ProjectCover = {
  screens: string[];
  /** Defaults to the project's `logo` */
  logo?: string;
  tagline?: string;
  color?: string;
  colorTo?: string;
};

/**
 * A gallery item: either one `src` image (paths in public/images), or 1–3
 * phone `screens` [left, center, right] drawn as a device mockup.
 */
export type GalleryShot = {
  alt: string;
  src?: string;
  screens?: string[];
  caption?: string;
};

export type RoadmapStep = {
  label: string;
  state: "done" | "active" | "todo";
  note?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: Category;
  /** Extra badge label, e.g. "Flutter" → "MOBILE · FLUTTER" */
  kind?: string;
  /** 1–2 sentences for the card */
  summary: string;
  /** Opening line on the detail page */
  tagline: string;
  stack: string[];
  role: string;
  duration: string;
  platform: string;
  year: number;
  status: Status;
  /** Overrides the status text on the detail page, e.g. "Available soon on Play Store" */
  statusNote?: string;
  /** App icon (square image in public/images); shown next to the title and on the cover */
  logo?: string;
  /** Example: "Q1 2027" */
  releaseTarget?: string;
  /** 0–100, progress toward release */
  progress?: number;
  links: ProjectLinks;
  demo?: ProjectDemo;
  stats?: ProjectStat[];
  highlights: string[];
  roadmap?: RoadmapStep[];
  /**
   * Detail page showcase. `screens` = three phone screenshots
   * [left, center, right]; without them the center phone shows label/value.
   */
  showcase?: { label?: string; value?: string; screens?: string[] };
  /** Card cover. Falls back to `showcase.screens`, then the phone mock. */
  cover?: ProjectCover;
  /** Gallery items, max. 3 */
  gallery?: GalleryShot[];
  featured: boolean;
  order: number;
  /** Section headings (h2) in the MDX, for the table of contents */
  headings: { id: string; title: string }[];
};

export type CategoryCounts = Record<Category | "all", number>;

export const categoryLabels: Record<Category, string> = {
  mobile: "Mobile",
  web: "Web",
};

export const statusLabels: Record<Status, string> = {
  released: "Released",
  developed: "Developed",
  beta: "Beta testing",
  development: "In development",
  prototype: "Prototype",
};

/** Status pill look: finished work is green and still; work in progress is amber and pulses. */
export function statusPillTone(status: Status) {
  const done = status === "released" || status === "developed";
  return { tone: done ? "live" : "progress", pulse: !done } as const;
}

export function badgeLabel(project: Pick<Project, "category" | "kind">) {
  const base = categoryLabels[project.category].toUpperCase();
  return project.kind ? `${base} · ${project.kind.toUpperCase()}` : base;
}

export function isReleased(project: Pick<Project, "status">) {
  return project.status === "released";
}

/** Full status text, e.g. "Beta testing · release Q1 2027", or `statusNote` if set. */
export function statusText(project: Pick<Project, "status" | "releaseTarget" | "statusNote">) {
  if (project.statusNote) return project.statusNote;
  const label = statusLabels[project.status];
  return project.releaseTarget && project.status !== "released"
    ? `${label} · release ${project.releaseTarget}`
    : label;
}

export type StoreLink = { label: string; href: string };

/** Destination buttons for released projects, in priority order. */
export function storeLinks(project: Pick<Project, "links">): StoreLink[] {
  const { links } = project;
  const out: StoreLink[] = [];
  if (links.playStore) out.push({ label: "Play Store", href: links.playStore });
  if (links.appStore) out.push({ label: "App Store", href: links.appStore });
  if (links.live) out.push({ label: "Visit site", href: links.live });
  return out;
}

/**
 * Button rules (PLAN 2.5):
 * - `released` → store/site button (or GitHub if there is none)
 * - other statuses → "Watch demo" (if there is a demo) + status badge
 */
export type PrimaryAction =
  { kind: "demo"; label: string } | { kind: "link"; label: string; href: string };

export function primaryAction(project: Project): PrimaryAction | null {
  if (isReleased(project)) {
    const [store] = storeLinks(project);
    if (store) return { kind: "link", ...store };
  } else if (project.demo) {
    return { kind: "demo", label: "Watch demo" };
  }
  if (project.links.github) return { kind: "link", label: "GitHub", href: project.links.github };
  return null;
}

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}
