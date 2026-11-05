/**
 * Tipe & helper proyek yang aman dipakai di client component
 * (tanpa akses file system). Pembaca file ada di `lib/projects.ts`.
 */

export const categories = ["mobile", "web", "tools"] as const;
export type Category = (typeof categories)[number];

export const statuses = ["released", "beta", "development", "prototype"] as const;
export type Status = (typeof statuses)[number];

export type ProjectLinks = {
  github?: string;
  playStore?: string;
  appStore?: string;
  apk?: string;
  live?: string;
};

export type DemoChapter = {
  /** Detik dari awal video */
  at: number;
  label: string;
};

export type ProjectDemo = {
  video?: string;
  poster?: string;
  chapters: DemoChapter[];
};

export type ProjectStat = { value: string; label: string };

export type RoadmapStep = {
  label: string;
  state: "done" | "active" | "todo";
  note?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: Category;
  /** Label tambahan di badge, mis. "CLI" → "TOOLS · CLI" */
  kind?: string;
  /** 1–2 kalimat untuk kartu */
  summary: string;
  /** Kalimat pembuka di halaman detail */
  tagline: string;
  stack: string[];
  role: string;
  duration: string;
  platform: string;
  year: number;
  status: Status;
  /** Contoh: "Q1 2027" */
  releaseTarget?: string;
  /** 0–100, progres menuju rilis */
  progress?: number;
  links: ProjectLinks;
  demo?: ProjectDemo;
  stats?: ProjectStat[];
  highlights: string[];
  roadmap?: RoadmapStep[];
  /** Isi layar HP utama di showcase halaman detail */
  showcase?: { label: string; value: string };
  /** Output terminal untuk thumbnail proyek CLI */
  terminal?: string[];
  /** Screenshot galeri (path di public/images), maks. 3 */
  gallery?: { src: string; alt: string }[];
  featured: boolean;
  order: number;
  /** Judul bagian (h2) di MDX, untuk daftar isi */
  headings: { id: string; title: string }[];
};

export type CategoryCounts = Record<Category | "all", number>;

export const categoryLabels: Record<Category, string> = {
  mobile: "Mobile",
  web: "Web",
  tools: "Tools",
};

export const statusLabels: Record<Status, string> = {
  released: "Rilis",
  beta: "Uji beta",
  development: "Dalam pengembangan",
  prototype: "Prototipe",
};

export function badgeLabel(project: Pick<Project, "category" | "kind">) {
  const base = categoryLabels[project.category].toUpperCase();
  return project.kind ? `${base} · ${project.kind.toUpperCase()}` : base;
}

export function isReleased(project: Pick<Project, "status">) {
  return project.status === "released";
}

/** Teks status lengkap, mis. "Uji beta · rilis Q1 2027". */
export function statusText(project: Pick<Project, "status" | "releaseTarget">) {
  const label = statusLabels[project.status];
  return project.releaseTarget && project.status !== "released"
    ? `${label} · rilis ${project.releaseTarget}`
    : label;
}

export type StoreLink = { label: string; href: string };

/** Tombol tujuan untuk proyek yang sudah rilis, urut prioritas. */
export function storeLinks(project: Pick<Project, "links">): StoreLink[] {
  const { links } = project;
  const out: StoreLink[] = [];
  if (links.playStore) out.push({ label: "Play Store", href: links.playStore });
  if (links.appStore) out.push({ label: "App Store", href: links.appStore });
  if (links.live) out.push({ label: "Kunjungi situs", href: links.live });
  return out;
}

/**
 * Aturan tombol (PLAN 2.5):
 * - `released` → tombol store/situs (atau GitHub bila tidak ada)
 * - status lain → "Tonton demo" (bila ada demo) + badge status
 */
export type PrimaryAction =
  { kind: "demo"; label: string } | { kind: "link"; label: string; href: string };

export function primaryAction(project: Project): PrimaryAction | null {
  if (isReleased(project)) {
    const [store] = storeLinks(project);
    if (store) return { kind: "link", ...store };
  } else if (project.demo) {
    return { kind: "demo", label: "Tonton demo" };
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
