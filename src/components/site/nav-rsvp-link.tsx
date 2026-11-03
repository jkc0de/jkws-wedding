"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GROOM_FIRST_PARAM, withFlag } from "@/lib/names";

/** Header RSVP button that carries the `?g` flag along when it is present. */
export function NavRsvpLink() {
  return (
    <Suspense fallback={<RsvpButton href="/rsvp" />}>
      <FlagAwareRsvpButton />
    </Suspense>
  );
}

function FlagAwareRsvpButton() {
  const params = useSearchParams();
  return <RsvpButton href={withFlag("/rsvp", params.has(GROOM_FIRST_PARAM))} />;
}

function RsvpButton({ href }: { href: string }) {
  return (
    <Button asChild className="rounded-full px-5">
      <Link href={href}>RSVP</Link>
    </Button>
  );
}
