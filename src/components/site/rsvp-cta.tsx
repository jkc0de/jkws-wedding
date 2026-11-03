import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "./section";

export function RsvpCta({ href = "/rsvp" }: { href?: string }) {
  return (
    <Section
      id="rsvp"
      eyebrow="Be our guest"
      title="Will you join us?"
      intro="We would be honoured to have you with us. Kindly respond by 1st December 2026."
      className="bg-white"
    >
      <div className="flex justify-center">
        <Button asChild className="h-12 rounded-full px-10 text-base">
          <Link href={href}>RSVP now</Link>
        </Button>
      </div>
    </Section>
  );
}
