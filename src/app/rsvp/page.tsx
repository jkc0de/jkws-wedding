import type { Metadata } from "next";
import Image from "next/image";
import { FlagLink } from "@/components/site/flag-link";
import { ArrowLeftIcon } from "lucide-react";
import { RsvpForm } from "@/components/site/rsvp-form";
import { hasGroomFlag, sideFromFlag } from "@/lib/names";

export const metadata: Metadata = {
  title: "RSVP",
  description: "Let us know who is coming to our wedding on 23 January 2027.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RsvpPage({ searchParams }: Props) {
  const groomFirst = hasGroomFlag(await searchParams);
  return (
    <main className="flex-1 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-xl">
        <FlagLink
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeftIcon className="size-4" />
          Back to the wedding
        </FlagLink>

        <div className="flex flex-col items-center text-center">
          <p className="section-eyebrow">Be our guest</p>
          <h1 className="mt-3 font-serif text-5xl font-light sm:text-6xl">RSVP</h1>
          <p className="mt-4 font-serif text-xl text-foreground/80">Saturday, 23 January 2027</p>
          <Image
            src="/st-regis-logo.svg"
            alt="St. Regis"
            width={252}
            height={69}
            className="mt-5 h-10 w-auto sm:h-12"
          />
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Kuala Lumpur
          </p>
          <p className="mt-2 text-muted-foreground">
            Please let us know if you can make it, and who is coming with you.
          </p>
        </div>

        <div className="mt-12">
          <RsvpForm side={sideFromFlag(groomFirst)} />
        </div>
      </div>
    </main>
  );
}
