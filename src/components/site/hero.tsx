import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { FlagLink } from "./flag-link";
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

export function Hero({ names }: { names: [string, string] }) {
  const [first, second] = names;
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

          <h1 className="mt-6 font-serif text-5xl font-light leading-none tracking-tight text-foreground sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block whitespace-nowrap">{first}</span>
            <span className="my-2 block italic text-primary">&amp;</span>
            <span className="block whitespace-nowrap">{second}</span>
          </h1>

          <p
            className={cn(
              "mt-8 font-serif text-3xl sm:text-4xl",
              hasHeroImage ? "text-foreground md:text-foreground/80" : "text-foreground/80",
            )}
          >
            Saturday, 23 January 2027
          </p>
          <p
            className={cn(
              "mt-2 text-sm uppercase tracking-[0.25em]",
              hasHeroImage
                ? "font-medium text-foreground md:font-normal md:text-muted-foreground"
                : "text-muted-foreground",
            )}
          >
            The St. Regis Kuala Lumpur
          </p>

          <div className="mt-10">
            <Countdown target={WEDDING_DATETIME} onPhoto={hasHeroImage} />
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-11 rounded-full px-8 text-base">
              <FlagLink href="/rsvp">RSVP</FlagLink>
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
