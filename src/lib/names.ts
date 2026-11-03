export const BRIDE = "Wong Wai Seun";
export const GROOM = "Jordan Koh";

/**
 * Bride first by default. Add `?g` to the home page link to show the groom
 * first instead, e.g. https://example.com/?g for the groom's side.
 */
export const GROOM_FIRST_PARAM = "g";

export function coupleNames(groomFirst: boolean): [string, string] {
  return groomFirst ? [GROOM, BRIDE] : [BRIDE, GROOM];
}

export function coupleTitle(groomFirst: boolean) {
  return coupleNames(groomFirst).join(" & ");
}

/** Guest side implied by the link flag. */
export function sideFromFlag(groomFirst: boolean): "bride" | "groom" {
  return groomFirst ? "groom" : "bride";
}

/** Append the flag to an internal link when it is active, keeping any #hash last. */
export function withFlag(href: string, groomFirst: boolean) {
  if (!groomFirst || href.startsWith("#") || /^[a-z]+:/i.test(href)) return href;
  const [path, hash] = href.split("#");
  const flagged = `${path}${path.includes("?") ? "&" : "?"}${GROOM_FIRST_PARAM}`;
  return hash ? `${flagged}#${hash}` : flagged;
}
