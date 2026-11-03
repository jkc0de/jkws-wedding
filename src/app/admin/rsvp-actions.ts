"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { rsvpSchema } from "@/lib/rsvp/schema";
import { DuplicateNameError, getRsvpStore } from "@/lib/rsvp/store";

export type AdminRsvpState = { status: "idle" } | { status: "error"; message: string } | { status: "saved" };

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v : "";
}

/** Create (no id) or update (with id) an RSVP from the admin editor. */
export async function saveRsvpAsAdmin(_prev: AdminRsvpState, formData: FormData): Promise<AdminRsvpState> {
  if (!(await isAdmin())) return { status: "error", message: "Your admin session has expired. Sign in again." };

  const id = str(formData.get("id"));
  const parsed = rsvpSchema.safeParse({
    fullName: str(formData.get("fullName")),
    attendance: str(formData.get("attendance")),
    guests: str(formData.get("guests"))
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean),
    dietary: str(formData.get("dietary")),
    message: str(formData.get("message")),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the fields." };
  }

  try {
    const store = await getRsvpStore();
    if (id) {
      const updated = await store.update(id, parsed.data);
      if (!updated) return { status: "error", message: "That RSVP no longer exists." };
    } else {
      await store.save(parsed.data);
    }
  } catch (error) {
    if (error instanceof DuplicateNameError) return { status: "error", message: error.message };
    console.error("Admin save failed", error);
    return { status: "error", message: "Could not save. Please try again." };
  }

  revalidatePath("/admin");
  return { status: "saved" };
}

export async function deleteRsvpAsAdmin(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = str(formData.get("id"));
  if (!id) return;
  const store = await getRsvpStore();
  await store.remove(id);
  revalidatePath("/admin");
}
