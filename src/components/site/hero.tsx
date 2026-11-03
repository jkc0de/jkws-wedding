import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Countdown } from "./countdown";

/** Cocktails start, Malaysia time. */
const WEDDING_DATETIME = "2027-01-23T18:00:00+08:00";

/**
 * Banner photo: /public/hero.jpg (portrait works best).
 * Phones: full-bleed behind the text under a light buttercream wash.
 * Tablet and desktop: fills the right half edge to edge, text on the left.
 * If the file is missing the banner is text only.
 */
const HERO_IMAGE = "/hero.jpg";
const hasHeroImage = existsSync(path.join(process.cwd(), "public", HERO_IMAGE));

export function Hero() {
  return (
    <section
      id="top"
      className={cn(
        "relative isolate grid min-h-[calc(100svh-6rem)] overflow-hidden md:min-h-[calc(100svh-3.5rem)]",
        hasHeroImage && "md:grid-cols-2",
      )}
    >
      {hasHeroImage ? (
        <div aria-hidden className="absolute inset-0 -z-10 md:left-1/2">
          {/* Phones show the left of the photo so the couple sits further right */}
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[20%_center] md:object-center"
          />
          {/* Soft buttercream wash keeps the dark text readable on phones */}
          <div className="absolute inset-0 bg-buttercream/60 md:hidden" />
        </div>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,rgba(150,30,46,0.08),transparent_60%)]"
      />

      <div className="flex items-center justify-center px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Together with their families
          </p>

          <h1 className="mt-6 font-serif text-6xl font-light leading-none tracking-tight text-foreground sm:text-7xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block whitespace-nowrap">Jordan Koh</span>
            <span className="my-2 block italic text-primary">&amp;</span>
            <span className="block whitespace-nowrap">Wong Wai Seun</span>
          </h1>

          <p className="mt-8 font-serif text-2xl text-foreground/80 sm:text-3xl">
            Saturday, 23 January 2027
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            The St. Regis Kuala Lumpur
          </p>

          <div className="mt-10">
            <Countdown target={WEDDING_DATETIME} />
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-11 rounded-full px-8 text-base">
              <Link href="/rsvp">RSVP</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full px-8 text-base">
              <a href="#details">View details</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
