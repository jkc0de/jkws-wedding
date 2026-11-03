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
