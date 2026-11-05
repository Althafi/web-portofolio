/**
 * Data profil — masih dummy. Ganti dengan data asli di Fase 9
 * (lihat docs/CHECKLIST-DATA.md).
 */

export type SocialLink = {
  label: string;
  short: string;
  href: string;
};

export type Experience = {
  period: string;
  role: string;
  place: string;
  type: string;
};

export type TechGroup = {
  label: string;
  items: string[];
};

export const profile = {
  name: "Altap",
  handle: "altap",
  role: "Software engineer",
  available: true,
  availability: "Tersedia untuk proyek freelance",
  headline: "Software engineer yang membangun aplikasi mobile, web & tools CLI.",
  rotatingWords: ["mobile", "web", "CLI"],
  bio: "Hai, saya Altap. Saya fokus membuat produk yang cepat, rapi, dan enak dipakai — dari aplikasi Flutter sampai CLI kecil yang menghemat waktu developer.",
  about: [
    "Saya software engineer yang paling betah di persimpangan antara produk dan kode. Sebagian besar waktu saya habiskan membangun aplikasi mobile dengan Flutter dan Kotlin, lalu merapikan alur kerja developer lewat tools CLI kecil.",
    "Saya suka produk yang terasa cepat, tetap jalan saat koneksi buruk, dan tidak membuat penggunanya berpikir dua kali. Di luar pekerjaan, saya menulis catatan teknis dan ikut merawat beberapa proyek open source.",
  ],
  location: "Jakarta",
  timezone: "Asia/Jakarta",
  timezoneLabel: "WIB",
  email: "halo@altap.dev",
  cv: "/cv.pdf",
  /** Foto formal rasio ±4:5 di public/images, mis. "/images/foto.jpg". Kosong = placeholder. */
  photo: undefined as string | undefined,
  replyTime: "Balasan biasanya < 24 jam.",
  socials: [
    { label: "GitHub", short: "GH", href: "https://github.com/altap" },
    { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/altap" },
  ] satisfies SocialLink[],
  experience: [
    {
      period: "2024 — Sekarang",
      role: "Mobile Engineer",
      place: "PT Contoh Teknologi",
      type: "Full-time",
    },
    {
      period: "2023 — 2024",
      role: "Software Engineer Intern",
      place: "Startup Contoh",
      type: "Magang",
    },
    {
      period: "2022 — Sekarang",
      role: "Freelance Developer",
      place: "Mandiri",
      type: "Remote",
    },
  ] satisfies Experience[],
  techStack: [
    { label: "Mobile", items: ["Flutter", "Dart", "Kotlin", "Swift"] },
    { label: "Web", items: ["TypeScript", "React", "Next.js"] },
    { label: "Backend & tools", items: ["Go", "Node.js", "PostgreSQL", "Firebase"] },
  ] satisfies TechGroup[],
} as const;

export const mailto = `mailto:${profile.email}`;

/** Semua tech stack dalam satu daftar datar (untuk marquee). */
export const allTech = profile.techStack.flatMap((g) => g.items);
