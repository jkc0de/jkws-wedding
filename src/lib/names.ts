export const BRIDE = "Wong Wai Seun";
export const GROOM = "Jordan Koh";

/**
 * Bride first by default. Add `?g` to the home page link to show the groom
 * first instead, e.g. https://example.com/?g for the groom's side.
 */
export const GROOM_FIRST_PARAM = "g";

type ParamsLike = { has(name: string): boolean; get(name: string): string | null };

/**
 * True when the groom-first flag is present. Accepts the canonical `?g`,
 * `?g=1`, and the easy-to-type slip `?=g`.
 */
export function hasGroomFlag(params: ParamsLike | Record<string, string | string[] | undefined>) {
  if (typeof (params as ParamsLike).has === "function") {
    const p = params as ParamsLike;
    return p.has(GROOM_FIRST_PARAM) || p.get("") === GROOM_FIRST_PARAM;
  }
  const record = params as Record<string, string | string[] | undefined>;
  const empty = record[""];
  return GROOM_FIRST_PARAM in record || empty === GROOM_FIRST_PARAM || (Array.isArray(empty) && empty.includes(GROOM_FIRST_PARAM));
}

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
