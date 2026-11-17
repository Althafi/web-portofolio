import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { LazyCursorGlow } from "@/components/effects/lazy";
import { mailto, profile } from "@/lib/profile";

export function ContactCta() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 pt-24 pb-[72px]">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-inverse-bg px-6 py-10 sm:px-12 sm:pt-14 sm:pb-7">
          <LazyCursorGlow />
          <div className="relative">
            <h2 id="contact-title" className="text-h2 text-inverse-fg">
              Have an idea you want to build?
            </h2>
            <p className="mt-1.5 text-base text-inverse-fg/65">
              I&apos;m open to freelance projects &amp; collaborations. {profile.replyTime}
            </p>
            <div className="mt-[19px] flex flex-wrap gap-2.5">
              <Button asChild variant="accent" size="md">
                <a href={mailto}>
                  Send email <ArrowRight className="size-4" aria-hidden />
                </a>
              </Button>
              <CopyEmailButton />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
