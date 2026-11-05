import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { mailto, profile } from "@/lib/profile";

export function ContactCta() {
  return (
    <section id="kontak" aria-labelledby="kontak-title" className="scroll-mt-24 pt-24 pb-[72px]">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-inverse-bg px-6 py-10 sm:px-12 sm:pt-14 sm:pb-7">
          <h2 id="kontak-title" className="text-h2 text-inverse-fg">
            Punya ide yang ingin dibangun?
          </h2>
          <p className="mt-1.5 text-base text-inverse-fg/65">
            Saya terbuka untuk proyek freelance &amp; kolaborasi. {profile.replyTime}
          </p>
          <div className="mt-[19px] flex flex-wrap gap-2.5">
            <Button asChild variant="accent" size="md">
              <a href={mailto}>
                Kirim email <ArrowRight className="size-4" aria-hidden />
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              data-copy-email
              className="border-inverse-fg/80 font-mono text-sm font-normal text-inverse-fg hover:bg-inverse-fg/10 hover:text-inverse-fg dark:hover:bg-inverse-fg/10"
            >
              Salin: {profile.email}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
