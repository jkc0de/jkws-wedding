"use server";

import { rsvpSchema, type Attendance } from "@/lib/rsvp/schema";
import { getRsvpStore } from "@/lib/rsvp/store";

export type RsvpValues = { fullName: string; attendance: string; side: string; guests: string[]; dietary: string; message: string };
export type RsvpFieldErrors = Partial<Record<keyof RsvpValues, string>>;

export type RsvpState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: RsvpFieldErrors; values: RsvpValues }
  | { status: "success"; fullName: string; attendance: Attendance; guests: string[]; updated: boolean };

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v : "";
}

export async function submitRsvp(_prev: RsvpState, formData: FormData): Promise<RsvpState> {
  const values: RsvpValues = {
    fullName: str(formData.get("fullName")),
    attendance: str(formData.get("attendance")),
    side: str(formData.get("side")),
    guests: formData.getAll("guests").map(str),
    dietary: str(formData.get("dietary")),
    message: str(formData.get("message")),
  };

  // Honeypot: real guests never see this field, so anything in it is a bot.
  if (str(formData.get("website")).length > 0) {
    return { status: "success", fullName: values.fullName || "Guest", attendance: "accept", guests: [], updated: false };
  }

  const parsed = rsvpSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: RsvpFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RsvpValues | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  try {
    const store = await getRsvpStore();
    const { rsvp, updated } = await store.save(parsed.data);
    return { status: "success", fullName: rsvp.fullName, attendance: rsvp.attendance, guests: rsvp.guests, updated };
  } catch (error) {
    console.error("Failed to save RSVP", error);
    return {
      status: "error",
      message: "Something went wrong saving your RSVP. Please try again.",
      fieldErrors: {},
      values,
    };
  }
}
