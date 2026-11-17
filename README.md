# Portofolio Althafi Hilal Anshar

Situs portofolio: aplikasi mobile dan web lengkap dengan studi kasus.
Dibangun dengan Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS v4,
shadcn/ui, Motion, dan MDX.

Rencana kerja per fase ada di [`docs/PLAN.md`](docs/PLAN.md), dan daftar data yang
perlu disiapkan ada di [`docs/CHECKLIST-DATA.md`](docs/CHECKLIST-DATA.md).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint
```

## Mengubah konten

| Yang diubah | Lokasi |
|---|---|
| Profil, bio, email, sosial, pengalaman, tech stack, foto | `src/lib/profile.ts` |
| Proyek (data di frontmatter, studi kasus di isi MDX) | `src/content/projects/*.mdx` |
| CV | `public/cv.pdf` |
| Foto & screenshot galeri | `public/images/` |
| Rekaman demo (MP4 vertikal) | `public/videos/` |
| Warna tema | `src/app/globals.css` (`:root` dan `.dark`) |

Menambah proyek cukup dengan membuat file `.mdx` baru di `src/content/projects/`.
Kartu, halaman detail, jumlah per kategori, sitemap, OG image, dan command palette
ikut diperbarui otomatis. Bila `status` diubah ke `released` dan `links.playStore` diisi,
tombol "Tonton demo" otomatis berganti menjadi tombol Play Store.

Frontmatter yang tersedia: lihat `src/content/projects/tickr.mdx` sebagai contoh
lengkap, dan tipe `Project` di `src/lib/project-types.ts`.

## Deploy (Vercel)

1. Import repo di Vercel (framework: Next.js, tanpa konfigurasi tambahan).
2. Opsional: setel `NEXT_PUBLIC_SITE_URL` ke domain kustom (dipakai untuk sitemap,
   canonical, dan Open Graph). Tanpa ini dipakai URL produksi Vercel.
3. Aktifkan **Analytics** dan **Speed Insights** di dashboard proyek Vercel.
   Komponennya sudah terpasang di `src/app/layout.tsx`.

## Struktur

```
src/
  app/                  halaman (beranda, proyek, proyek/[slug], tentang), OG image, sitemap, robots
  components/
    layout/             navbar, footer, command palette, transisi halaman, tema
    sections/           bagian beranda (hero, tech stack, proyek pilihan, pengalaman, CTA)
    project/            kartu proyek (flip), filter, modal demo, bagian halaman detail
    effects/            15 efek dari panel "Motion & Efek" (mati saat reduced motion)
    ui/                 komponen dasar (shadcn/ui + Badge, Chip, StatusPill, …)
  content/projects/     studi kasus MDX
  hooks/                reduced motion, posisi kursor, filter URL, ganti tema, salin email
  lib/                  data profil, pembaca proyek, tipe & aturan tombol, URL situs, OG
```
