"use server";

import { checkPassword, endAdminSession, startAdminSession } from "@/lib/admin-auth";
import { clearFailedLogins, loginBlockedFor, recordFailedLogin } from "@/lib/login-limiter";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const blockedMs = await loginBlockedFor();
  if (blockedMs > 0) {
    const minutes = Math.max(1, Math.ceil(blockedMs / 60000));
    return { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    await recordFailedLogin();
    return { error: "Incorrect password." };
  }

  await clearFailedLogins();
  await startAdminSession();
  return {};
}

export async function logout() {
  await endAdminSession();
}
