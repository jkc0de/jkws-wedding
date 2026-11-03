import { z } from "zod";

export const attendanceValues = ["accept", "decline"] as const;
export type Attendance = (typeof attendanceValues)[number];

const name = z
  .string()
  .trim()
  .transform((s) => s.replace(/\s+/g, " "))
  .pipe(z.string().max(120));

export const rsvpSchema = z
  .object({
    fullName: name.refine((s) => s.length >= 2, "Please enter your name."),
    attendance: z.enum(attendanceValues, { message: "Please let us know if you can make it." }),
    guests: z
      .array(name)
      // No limit for guests; this ceiling only stops abuse.
      .max(50, "That is more guests than we can seat in one RSVP.")
      .refine((list) => list.every((g) => g.length >= 2), {
        message: "Please fill in each guest's name or remove the empty row.",
      }),
    dietary: z.string().trim().max(500).optional().default(""),
    message: z.string().trim().max(1000).optional().default(""),
  })
  // Declining guests bring nobody and need no meal notes.
  .transform((data) =>
    data.attendance === "decline" ? { ...data, guests: [], dietary: "" } : data,
  );

export type RsvpInput = z.input<typeof rsvpSchema>;
export type RsvpData = z.output<typeof rsvpSchema>;

export type Rsvp = RsvpData & {
  id: string;
  guestCount: number;
  createdAt: string;
  updatedAt: string;
};
