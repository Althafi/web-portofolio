import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CommandMenuProvider } from "@/components/layout/command-menu";
import { MotionProvider } from "@/components/layout/motion-provider";
import { Preloader, PRELOADER_SCRIPT } from "@/components/effects/preloader";
import { getAllProjects } from "@/lib/projects";
import { profile } from "@/lib/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.bio,
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
      lang="id"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <head>
        {/* Tandai kunjungan berikutnya / reduced motion sebelum paint pertama */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
        <noscript>
          <style>{`.preloader{display:none}.hero-word,.hero-fade{animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <MotionProvider>
            <TooltipProvider>
              <Preloader />
              <CommandMenuProvider projects={commandProjects}>
                <Navbar />
                <main id="konten" className="flex-1">
                  {children}
                </main>
                <Footer />
              </CommandMenuProvider>
              <Toaster position="bottom-center" />
            </TooltipProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
