import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "wedding_admin";
const MIN_PASSWORD_LENGTH = 8;

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Admin is only available once ADMIN_PASSWORD is set to something sensible. */
export function isAdminConfigured() {
  return secret().length >= MIN_PASSWORD_LENGTH;
}

function sessionToken() {
  return createHmac("sha256", secret()).update("wedding-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(password: string) {
  return isAdminConfigured() && safeEqual(password, secret());
}

export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && safeEqual(value as string, sessionToken());
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
};

export async function startAdminSession() {
  (await cookies()).set(COOKIE, sessionToken(), { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
}

export async function endAdminSession() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
