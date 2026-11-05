import { renderOg, ogSize } from "@/lib/og";
import { profile } from "@/lib/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Portofolio",
    title: profile.headline,
    description: "Aplikasi mobile, web, dan tools CLI — lengkap dengan studi kasusnya.",
  });
}
