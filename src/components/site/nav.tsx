import Image from "next/image";
import Link from "next/link";
import { MusicToggle } from "./music-toggle";
import { NavRsvpLink } from "./nav-rsvp-link";

const links = [
  { href: "/#details", label: "Details" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image src="/logo.png" alt="S & J monogram" width={320} height={480} unoptimized priority className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MusicToggle />
          <NavRsvpLink />
        </div>
      </div>
      <nav className="flex items-center justify-center gap-8 border-t border-border/60 py-2 text-sm text-muted-foreground md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="transition-colors hover:text-primary">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
