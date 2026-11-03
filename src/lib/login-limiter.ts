import { headers } from "next/headers";

/**
 * Slows down password guessing. Per server instance and in memory, so on a
 * serverless host it is a speed bump rather than a wall, but combined with the
 * failed-attempt delay it makes brute force impractical.
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const FAIL_DELAY_MS = 800;

type Entry = { count: number; resetAt: number };
const attempts = new Map<string, Entry>();

async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Milliseconds until this client may try again, or 0 if allowed. */
export async function loginBlockedFor(): Promise<number> {
  const entry = attempts.get(await clientKey());
  if (!entry) return 0;
  if (entry.resetAt <= Date.now()) return 0;
  return entry.count >= MAX_ATTEMPTS ? entry.resetAt - Date.now() : 0;
}

export async function recordFailedLogin() {
  const key = await clientKey();
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
  // Keep the map small.
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) if (v.resetAt <= now) attempts.delete(k);
  }
  await new Promise((r) => setTimeout(r, FAIL_DELAY_MS));
}

export async function clearFailedLogins() {
  attempts.delete(await clientKey());
}
