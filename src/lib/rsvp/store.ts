import type { Rsvp, RsvpData } from "./schema";

/**
 * Storage abstraction for RSVPs.
 *
 * - With DATABASE_URL set (Neon, Supabase, Railway, any Postgres) responses go
 *   to a `rsvps` table that is created on first use.
 * - Without it, responses go to ./data/rsvps.json. Fine for local development,
 *   but NOT for Vercel or any serverless host, where the file does not persist.
 *
 * Saving is an upsert keyed on the respondent's name, so a guest can resubmit
 * to correct their RSVP instead of creating a duplicate.
 */
export interface RsvpStore {
  /** Upsert by name (used by the guest form and admin "add"). */
  save(data: RsvpData): Promise<SaveResult>;
  list(): Promise<Rsvp[]>;
  /** Admin edit by id. Throws DuplicateNameError if the new name belongs to another RSVP. */
  update(id: string, data: RsvpData): Promise<Rsvp | undefined>;
  /** Admin delete by id. Returns whether a row was removed. */
  remove(id: string): Promise<boolean>;
}

export type SaveResult = { rsvp: Rsvp; updated: boolean };

export class DuplicateNameError extends Error {
  constructor() {
    super("Another RSVP already uses this name.");
    this.name = "DuplicateNameError";
  }
}

/** Normalised key used to detect a resubmission by the same guest. */
export function nameKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Seats taken by this RSVP: zero if declining. */
export function toGuestCount(data: Pick<RsvpData, "guests" | "attendance">) {
  return data.attendance === "decline" ? 0 : 1 + data.guests.length;
}

let store: RsvpStore | undefined;

/** The untouched value from .env.example is not a real database. */
function isPlaceholder(url: string) {
  return /\/\/user:[^@]*@host[:/]/.test(url);
}

/** A usable DATABASE_URL, or undefined when unset or still the template value. */
export function databaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return undefined;
  if (isPlaceholder(url)) {
    console.warn("DATABASE_URL is still the example placeholder; using the local JSON file instead.");
    return undefined;
  }
  return url;
}

export async function getRsvpStore(): Promise<RsvpStore> {
  if (store) return store;
  const url = databaseUrl();
  if (url) {
    const { createPostgresStore } = await import("./store-postgres");
    store = createPostgresStore(url);
  } else {
    const { jsonFileStore } = await import("./store-json");
    store = jsonFileStore;
  }
  return store;
}
