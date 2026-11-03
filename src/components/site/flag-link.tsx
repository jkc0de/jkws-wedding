"use client";

import { Suspense, type ComponentProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GROOM_FIRST_PARAM, withFlag } from "@/lib/names";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Internal link that keeps the `?g` (groom first) flag when the visitor
 * arrived with it, so the whole site stays in the same version.
 */
export function FlagLink(props: Props) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <FlagAwareLink {...props} />
    </Suspense>
  );
}

function FlagAwareLink({ href, ...rest }: Props) {
  const params = useSearchParams();
  return <Link href={withFlag(href, params.has(GROOM_FIRST_PARAM))} {...rest} />;
}
