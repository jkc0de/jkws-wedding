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
    a: "Formal attire. Black tie is optional. Suits, long dresses and traditional wear are all welcome.",
  },
  {
    q: "Is there parking at the venue?",
    a: "Yes. The St. Regis offers valet parking at the main entrance. The hotel is also directly connected to KL Sentral, so KTM, LRT, MRT and KLIA Ekspres are all a short covered walk away.",
  },
  {
    q: "Need a room at The St. Regis?",
    a: "If you would like to stay at The St. Regis Kuala Lumpur, let us know and we can arrange preferential rates for our guests.",
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
