import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/proyek", "/tentang"].map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
  const projects = getAllProjects().map((p) => ({
    url: `${siteUrl}/proyek/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...projects];
}
