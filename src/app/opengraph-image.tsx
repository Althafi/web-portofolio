import { renderOg, ogSize } from "@/lib/og";
import { profile } from "@/lib/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Portfolio",
    title: profile.headline,
    description: "Mobile and web apps — each with its own case study.",
  });
}
