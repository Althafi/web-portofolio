import { PageTransition } from "@/components/layout/page-transition";
import { Hero } from "@/components/sections/hero";
import { TechStack } from "@/components/sections/tech-stack";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ExperienceSection } from "@/components/sections/experience";
import { ContactCta } from "@/components/sections/contact-cta";
import { getAllProjects, getCategoryCounts } from "@/lib/projects";

export default function Home() {
  const projects = getAllProjects();
  const counts = getCategoryCounts();

  return (
    <PageTransition>
      <Hero counts={counts} />
      <TechStack />
      <FeaturedProjects projects={projects} counts={counts} />
      <ExperienceSection />
      <ContactCta />
    </PageTransition>
  );
}
