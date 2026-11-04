import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "./section";

const faqs = [
  {
    q: "What time should I arrive?",
    a: "Cocktails start at 6:00 PM and dinner is served at 7:00 PM. Please arrive during the cocktail hour so you are seated before dinner begins.",
  },
  {
    q: "What is the dress code?",
    a: "Formal Attire. Suits, tuxedos and long dresses are all welcome.",
  },
  {
    q: "Is there parking at the venue?",
    a: "Yes. There is basement parking at the hotel, and valet parking is available at the main entrance. The St. Regis is also directly connected to KL Sentral, so KTM, LRT, MRT and KLIA Ekspres are all a short covered walk away.",
  },
  {
    q: "When should I RSVP by?",
    a: "Please respond by 1st December 2026 on the RSVP page so we can confirm numbers with the venue.",
  },
];

export function Faq() {
  return (
    <Section id="faq" eyebrow="Good to know" title="Questions & Answers">
      <Accordion type="single" collapsible className="mx-auto max-w-2xl">
        {faqs.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger className="items-center gap-4 py-7 text-left font-serif text-xl leading-snug sm:text-2xl **:data-[slot=accordion-trigger-icon]:size-5">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
