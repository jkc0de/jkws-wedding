import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Rsvp } from "./schema";
import { DuplicateNameError, nameKey, toGuestCount, type RsvpStore } from "./store";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

async function readAll(): Promise<Rsvp[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Rsvp[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

let queue: Promise<unknown> = Promise.resolve();

/** Serialise writes so concurrent submissions don't clobber the file. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export const jsonFileStore: RsvpStore = {
  async save(data) {
    return withLock(async () => {
      await mkdir(DATA_DIR, { recursive: true });
      const all = await readAll();
      const now = new Date().toISOString();
      const key = nameKey(data.fullName);
      const index = all.findIndex((r) => nameKey(r.fullName) === key);

      if (index >= 0) {
        const existing = all[index];
        const rsvp: Rsvp = {
          ...existing,
          ...data,
          guestCount: toGuestCount(data),
          updatedAt: now,
        };
        all[index] = rsvp;
        await writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf8");
        return { rsvp, updated: true };
      }

      const rsvp: Rsvp = {
        ...data,
        id: crypto.randomUUID(),
        guestCount: toGuestCount(data),
        createdAt: now,
        updatedAt: now,
      };
      all.push(rsvp);
      await writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf8");
      return { rsvp, updated: false };
    });
  },
  async list() {
    const all = await readAll();
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async update(id, data) {
    return withLock(async () => {
      const all = await readAll();
      const index = all.findIndex((r) => r.id === id);
      if (index < 0) return undefined;
      const key = nameKey(data.fullName);
      if (all.some((r) => r.id !== id && nameKey(r.fullName) === key)) throw new DuplicateNameError();
      const rsvp: Rsvp = {
        ...all[index],
        ...data,
        guestCount: toGuestCount(data),
        updatedAt: new Date().toISOString(),
      };
      all[index] = rsvp;
      await writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf8");
      return rsvp;
    });
  },
  async remove(id) {
    return withLock(async () => {
      const all = await readAll();
      const remaining = all.filter((r) => r.id !== id);
      if (remaining.length === all.length) return false;
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(DATA_FILE, JSON.stringify(remaining, null, 2), "utf8");
      return true;
    });
  },
};
