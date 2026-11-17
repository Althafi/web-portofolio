import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

export const ogSize = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

// Read synchronously so the OG image is prerendered at build time (Cache Components)
function fonts() {
  const read = (file: string) => readFileSync(path.join(fontDir, file));
  return [
    {
      name: "Geist",
      data: read("geist-sans/Geist-Regular.ttf"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: read("geist-sans/Geist-SemiBold.ttf"),
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "GeistMono",
      data: read("geist-mono/GeistMono-Regular.ttf"),
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

/** Design-styled Open Graph image: white background, accent blob, large title. */
export async function renderOg({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#ffffff",
        color: "#09090b",
        fontFamily: "Geist",
        backgroundImage: "radial-gradient(circle at 85% 20%, #eaf3fa 0%, #ffffff 55%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {profile.handle}
        </div>
        {/* Terminal cursor logo mark */}
        <div style={{ width: 17, height: 34, background: "#2971a6", borderRadius: 3 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "GeistMono",
            fontSize: 22,
            color: "#2971a6",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, color: "#6b6b74", lineHeight: 1.4, maxWidth: 960 }}>
          {description}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: fonts() },
  );
}
