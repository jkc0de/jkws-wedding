import Image from "next/image";
import { MusicToggle } from "./music-toggle";
import { FlagLink } from "./flag-link";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#details", label: "Details" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <FlagLink href="/" aria-label="Home" className="flex items-center">
          <Image src="/logo.png" alt="S & J monogram" width={320} height={480} priority unoptimized className="h-10 w-auto" />
        </FlagLink>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <FlagLink key={l.href} href={l.href} className="transition-colors hover:text-primary">
              {l.label}
            </FlagLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MusicToggle />
          <Button asChild className="rounded-full px-5">
            <FlagLink href="/rsvp">RSVP</FlagLink>
          </Button>
        </div>
      </div>
      <nav className="flex items-center justify-center gap-8 border-t border-border/60 py-2 text-sm text-muted-foreground md:hidden">
        {links.map((l) => (
          <FlagLink key={l.href} href={l.href} className="transition-colors hover:text-primary">
            {l.label}
          </FlagLink>
        ))}
      </nav>
    </header>
  );
}
