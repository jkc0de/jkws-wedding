import { Hero } from "@/components/site/hero";
import { Details } from "@/components/site/details";
import { Gallery } from "@/components/site/gallery";
import { Faq } from "@/components/site/faq";
import { RsvpCta } from "@/components/site/rsvp-cta";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Details />
      <Gallery />
      <Faq />
      <RsvpCta />
    </main>
  );
}
