import {
  siAndroid,
  siAnthropic,
  siDart,
  siDbeaver,
  siDotnet,
  siFirebase,
  siFlutter,
  siGit,
  siGoogleplay,
  siHuggingface,
  siJetpackcompose,
  siJunit5,
  siKotlin,
  siKtor,
  siLangchain,
  siLaravel,
  siCodeigniter,
  siMysql,
  siNextdotjs,
  siOllama,
  siPhp,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siSquare,
  siSwift,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

export type TechLogo =
  | { kind: "brand"; icon: SimpleIcon }
  /** Logos missing from simple-icons, stored in public/images/tech. */
  | { kind: "image"; src: string };

const brand = (icon: SimpleIcon): TechLogo => ({ kind: "brand", icon });
const image = (file: string): TechLogo => ({ kind: "image", src: `/images/tech/${file}` });

/**
 * Tech name (as written in profile.techStack or a project's `stack`) → logo.
 * Names missing here render a monogram fallback, so add new tech here too.
 */
const techLogos: Record<string, TechLogo> = {
  // Mobile
  Kotlin: brand(siKotlin),
  "Jetpack Compose": brand(siJetpackcompose),
  "Kotlin Multiplatform": brand(siKotlin),
  "Compose Multiplatform": brand(siJetpackcompose),
  Swift: brand(siSwift),
  Flutter: brand(siFlutter),
  Dart: brand(siDart),
  // Web
  PHP: brand(siPhp),
  Laravel: brand(siLaravel),
  "Laravel Sanctum": brand(siLaravel),
  CodeIgniter: brand(siCodeigniter),
  ".NET": brand(siDotnet),
  "Next.js": brand(siNextdotjs),
  React: brand(siReact),
  TypeScript: brand(siTypescript),
  "Tailwind CSS": brand(siTailwindcss),
  MySQL: brand(siMysql),
  PostgreSQL: brand(siPostgresql),
  // Libraries & tools
  Riverpod: image("riverpod.svg"),
  Koin: image("koin.png"),
  Ktor: brand(siKtor),
  /** Retrofit has no logo of its own; it's a Square library. */
  Retrofit: brand(siSquare),
  SQLDelight: image("sqldelight.svg"),
  Firebase: brand(siFirebase),
  "Firebase Cloud Messaging": brand(siFirebase),
  PHPUnit: image("phpunit.svg"),
  Playwright: image("playwright.svg"),
  Git: brand(siGit),
  Postman: brand(siPostman),
  DBeaver: brand(siDbeaver),
  DataStore: brand(siAndroid),
  WorkManager: brand(siAndroid),
  "kotlinx-datetime": brand(siKotlin),
  "Android SDK": brand(siAndroid),
  "Google Play Console": brand(siGoogleplay),
  // Testing (Espresso & UI Automator are AndroidX libraries; Mockito has no logo → monogram)
  JUnit: brand(siJunit5),
  Espresso: brand(siAndroid),
  "UI Automator": brand(siAndroid),
  // AI engineering
  Python: brand(siPython),
  "Claude API": brand(siAnthropic),
  LangChain: brand(siLangchain),
  "Hugging Face": brand(siHuggingface),
  Ollama: brand(siOllama),
};

export function getTechLogo(name: string): TechLogo | undefined {
  return techLogos[name];
}

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** How a brand color should render: near-black follows the text color, dim colors get lifted on dark. */
export function brandTone(hex: string): "ink" | "dim" | "normal" {
  const l = luminance(hex);
  if (l < 0.06) return "ink";
  if (l < 0.12) return "dim";
  return "normal";
}
