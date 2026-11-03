export const dynamic = "force-static";

// 6:00 PM to 11:00 PM Malaysia time (UTC+8), expressed in UTC.
const ics = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Wong Wai Seun & Jordan Koh//Wedding//EN",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "BEGIN:VEVENT",
  "UID:wedding-2027-01-23@wai-seun-and-jordan",
  "DTSTAMP:20261101T000000Z",
  "DTSTART:20270123T100000Z",
  "DTEND:20270123T160000Z",
  "SUMMARY:Wong Wai Seun & Jordan Koh's Wedding",
  "LOCATION:The St. Regis Kuala Lumpur\\, No. 6\\, Jalan Stesen Sentral 2\\, 50470 Kuala Lumpur",
  "DESCRIPTION:Cocktails at 6:00 PM\\, dinner at 7:00 PM\\, after party at 10:30 PM. Dress code: formal.",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

export function GET() {
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wai-seun-and-jordan-wedding.ics"',
    },
  });
}
