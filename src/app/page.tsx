import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { Details } from "@/components/site/details";
import { Gallery } from "@/components/site/gallery";
import { Faq } from "@/components/site/faq";
import { RsvpCta } from "@/components/site/rsvp-cta";
import { coupleNames, coupleTitle, GROOM_FIRST_PARAM } from "@/lib/names";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function groomFirstFrom(searchParams: Props["searchParams"]) {
  return GROOM_FIRST_PARAM in (await searchParams);
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const groomFirst = await groomFirstFrom(searchParams);
  const title = coupleTitle(groomFirst);
  const ogImage = groomFirst ? `/og?${GROOM_FIRST_PARAM}` : "/og";
  return {
    title: { absolute: `${title} — 23 January 2027` },
    openGraph: {
      title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${title} — 23 January 2027, The St. Regis Kuala Lumpur`,
        },
      ],
    },
    twitter: { title, images: [ogImage] },
  };
}

export default async function Home({ searchParams }: Props) {
  const groomFirst = await groomFirstFrom(searchParams);
  return (
    <main className="flex-1">
      <Hero names={coupleNames(groomFirst)} />
      <Details />
      <Gallery />
      <Faq />
      <RsvpCta />
    </main>
  );
}
