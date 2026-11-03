# Wai Seun & Jordan — Wedding Website

One-page wedding site with a guest RSVP flow, built with Next.js, Tailwind CSS and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. RSVPs are saved to `data/rsvps.json` until a database is configured.

## Pages

| Route        | What it is                                             |
| ------------ | ------------------------------------------------------ |
| `/`          | Main page, bride's name first. `/?g` shows the groom first |
| `/rsvp`      | RSVP form (share this link directly with guests)       |
| `/admin`     | Password-protected list of responses with CSV download |
| `/calendar`  | Downloadable calendar invite (.ics)                    |

## Content

Everything lives in the components, no CMS:

- Names, date, countdown target: `src/components/site/hero.tsx`
- Venue, times, dress code, map and calendar links: `src/components/site/details.tsx`
- FAQ: `src/components/site/faq.tsx`
- RSVP copy and validation: `src/components/site/rsvp-form.tsx`, `src/lib/rsvp/schema.ts`

## Photos

- **Banner**: save your photo as `public/hero.jpg` (portrait, 2:3). It appears beside the names on desktop and below them on phones.
- **Gallery**: drop images into `public/gallery/`. They appear sorted by filename. Rebuild or redeploy after adding.

## Music

`public/audio/canon-in-d.m4a` plays on loop once a guest taps anywhere. The speaker button in the header mutes it. Replace the file to change the track.

## Going live

1. Copy `.env.example` to `.env.local` and fill it in.
2. Create a Postgres database (Neon and Supabase both have free tiers) and set `DATABASE_URL`. The `rsvps` table is created on first use.
3. Set `ADMIN_PASSWORD` to view responses at `/admin`.
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain so WhatsApp link previews work.
5. Deploy to Vercel (or any Node host) with those three variables set.

Without `DATABASE_URL`, RSVPs on a serverless host are lost between requests.
