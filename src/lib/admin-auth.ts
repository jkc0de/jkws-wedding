import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "wedding_admin";
const MIN_PASSWORD_LENGTH = 8;
const SESSION_DAYS = 30;

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Admin is only available once ADMIN_PASSWORD is set to something sensible. */
export function isAdminConfigured() {
  return secret().length >= MIN_PASSWORD_LENGTH;
}

function sign(expiresAt: number) {
  return createHmac("sha256", secret()).update(`wedding-admin-session-v2:${expiresAt}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(password: string) {
  return isAdminConfigured() && safeEqual(password, secret());
}

/**
 * Session cookie is `<expiry>.<hmac>`: it expires on its own, and changing
 * ADMIN_PASSWORD invalidates every existing session.
 */
export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expiryText, mac] = value.split(".");
  const expiresAt = Number(expiryText);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !mac) return false;
  return safeEqual(mac, sign(expiresAt));
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
};

export async function startAdminSession() {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  (await cookies()).set(COOKIE, `${expiresAt}.${sign(expiresAt)}`, {
    ...cookieOptions,
    expires: new Date(expiresAt),
  });
}

export async function endAdminSession() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
