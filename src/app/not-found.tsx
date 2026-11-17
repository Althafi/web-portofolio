import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Badge>404</Badge>
      <h1 className="mt-4 text-title text-fg">Page not found</h1>
      <p className="mt-3 max-w-[460px] text-base text-muted">
        The project or page you&apos;re looking for doesn&apos;t exist, or its address has changed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Button asChild variant="primary" size="md">
          <Link href="/projects">View all projects</Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Container>
  );
}
