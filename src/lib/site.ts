/**
 * URL publik situs. Atur `NEXT_PUBLIC_SITE_URL` di Vercel bila memakai
 * domain kustom; tanpa itu dipakai URL produksi Vercel, lalu localhost.
 */
export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
})();
