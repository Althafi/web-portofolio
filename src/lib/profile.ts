/**
 * Profile data: edit here to update the name, bio, socials, and experience.
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
  /** Company logo in public/images (square). Empty = generic icon tile. */
  logo?: string;
};

export type TechGroup = {
  label: string;
  items: string[];
  /** Small badge next to the group title, e.g. "Learning". */
  badge?: string;
  /** Show in the home page marquee. Groups without this appear only on /about. */
  onHome: boolean;
};

export const profile = {
  name: "Althafi Hilal Anshar",
  handle: "Althafi",
  role: "Software developer",
  available: true,
  availability: "Available for freelance work",
  headline: "Software developer building mobile & web apps.",
  rotatingWords: ["mobile", "web"],
  bio: "Hi, I'm Althafi Hilal Anshar. I turn ideas into mobile and web apps that are easy to use, reliable, and thoughtfully built.",
  about: [
    "I'm a software developer at ADW Consulting who enjoys working across the stack, from backend and database design to polished mobile experiences.",
    "On the web, I build robust, secure systems with PHP and PostgreSQL, and I've remediated penetration test findings such as broken access control, IDOR, information disclosure, and business logic flaws. On mobile, I build and maintain Android apps in Kotlin, integrate them with backend APIs, and ship releases through Google Play Console.",
    "I'm currently exploring Kotlin Multiplatform, Flutter, and SwiftUI for cross-platform work, and learning AI engineering.",
    "Beyond code, I care about UI/UX design for web and mobile, because great products need both solid engineering and thoughtful design.",
  ],
  location: "Jakarta",
  timezone: "Asia/Jakarta",
  timezoneLabel: "WIB",
  email: "altp.hlnshr14@gmail.com",
  /** CV opens as a Google Drive preview (no download). */
  cv: "https://drive.google.com/file/d/1rY13B33dAs0_mBzQG2ScXNy2plzmmAib/view?usp=sharing",
  /** Formal photo, ~4:5 ratio, in public/images, e.g. "/images/photo.jpg". Empty = placeholder. */
  photo: "/images/photo.jpg" as string | undefined,
  replyTime: "I usually reply within 24 hours.",
  socials: [
    { label: "GitHub", short: "GH", href: "https://github.com/Althafi" },
    {
      label: "LinkedIn",
      short: "in",
      href: "https://www.linkedin.com/in/althafi-hilal-anshar-942271254",
    },
  ] satisfies SocialLink[],
  /** Short list only: scope & details live in the CV. */
  experience: [
    { period: "Present", role: "Freelance Developer", place: "Self-employed", type: "Freelance" },
    {
      period: "Apr 2025 — Present",
      role: "Software Developer",
      place: "ADW Consulting",
      logo: "/images/adw.png",
      type: "Contract",
    },
    {
      period: "Jul 2024 — Aug 2025",
      role: "Junior Android Developer",
      place: "ADW Consulting",
      logo: "/images/adw.png",
      type: "Contract",
    },
    {
      period: "May 2023 — Mar 2024",
      role: "Android Developer Intern",
      place: "ADW Consulting",
      logo: "/images/adw.png",
      type: "Internship",
    },
  ] as Experience[],
  techStack: [
    {
      label: "Mobile",
      items: [
        "Kotlin",
        "Jetpack Compose",
        "Kotlin Multiplatform",
        "Compose Multiplatform",
        "Swift",
        "Flutter",
        "Dart",
      ],
      onHome: true,
    },
    {
      label: "Web",
      items: [
        "PHP",
        "Laravel",
        "CodeIgniter",
        ".NET",
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "MySQL",
        "PostgreSQL",
      ],
      onHome: true,
    },
    {
      label: "Libraries & tools",
      items: [
        "Riverpod",
        "Koin",
        "Ktor",
        "Retrofit",
        "SQLDelight",
        "Firebase",
        "PHPUnit",
        "Playwright",
        "Git",
        "Postman",
        "DBeaver",
      ],
      onHome: false,
    },
    {
      label: "AI engineering",
      badge: "Learning",
      items: [],
      onHome: false,
    },
  ] satisfies TechGroup[],
} as const;

export const mailto = `mailto:${profile.email}`;

/** Languages & frameworks for the home page marquee (libraries & tools stay on /about). */
export const homeTech = profile.techStack.filter((g) => g.onHome).flatMap((g) => g.items);
