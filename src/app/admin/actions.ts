"use server";

import { checkPassword, endAdminSession, startAdminSession } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    return { error: "Incorrect password." };
  }
  await startAdminSession();
  return {};
}

export async function logout() {
  await endAdminSession();
}
