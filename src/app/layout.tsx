import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollToTop } from "@/components/effects/scroll-to-top";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenuProvider } from "@/components/layout/command-menu";
import { MotionProvider } from "@/components/layout/motion-provider";
import { Preloader, PRELOADER_SCRIPT } from "@/components/effects/preloader";
import { getAllProjects } from "@/lib/projects";
import { profile } from "@/lib/profile";
import { siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.bio,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: profile.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const commandProjects = getAllProjects().map(({ slug, title, category, stack }) => ({
    slug,
    title,
    category,
    stack,
  }));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <head>
        {/* Flag repeat visits / reduced motion before first paint */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
        <noscript>
          <style>{`.preloader{display:none}.hero-word,.hero-fade{animation:none!important}`}</style>
        </noscript>
      </head>
      {/* Extensions (e.g. ColorZilla `cz-shortcut-listen`) inject attributes on <body> */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <MotionProvider>
            <TooltipProvider>
              <Preloader />
              <a
                href="#content"
                className="sr-only z-[110] rounded-lg bg-inverse-bg px-4 py-2 text-sm font-medium text-inverse-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
              >
                Skip to content
              </a>
              <CommandMenuProvider projects={commandProjects}>
                <Navbar />
                <main id="content" tabIndex={-1} className="flex-1 outline-none">
                  {children}
                </main>
                <Footer />
                <ScrollToTop />
              </CommandMenuProvider>
              <Toaster position="bottom-center" />
            </TooltipProvider>
          </MotionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
