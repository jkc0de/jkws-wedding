import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex flex-col items-center border-t border-border/60 px-4 py-10 text-center">
      <Image src="/logo.png" alt="S & J monogram" width={320} height={480} unoptimized className="h-16 w-auto" />
      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        23 January 2027 · Kuala Lumpur
      </p>
    </footer>
  );
}
