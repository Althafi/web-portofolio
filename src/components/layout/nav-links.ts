export const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Proyek", href: "/proyek" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/#kontak" },
] as const;

export function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
