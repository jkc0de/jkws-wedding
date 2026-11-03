import { isAdmin } from "@/lib/admin-auth";
import { getRsvpStore } from "@/lib/rsvp/store";

export const dynamic = "force-dynamic";

function csvCell(value: string | number) {
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const store = await getRsvpStore();
  const rsvps = await store.list();

  const header = ["Name", "Reply", "Additional guests", "Seats", "Note", "Submitted", "Last updated"];
  const rows = rsvps.map((r) => [
    r.fullName,
    r.attendance === "accept" ? "Accepts" : "Declines",
    r.guests.join("; "),
    r.guestCount,
    r.message,
    r.createdAt,
    r.updatedAt,
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding-rsvps.csv"',
    },
  });
}
