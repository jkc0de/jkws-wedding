import type { Metadata } from "next";
import { DatabaseIcon, DownloadIcon, LogOutIcon, SearchIcon, TriangleAlertIcon } from "lucide-react";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { databaseHost, getRsvpStore } from "@/lib/rsvp/store";
import type { Rsvp } from "@/lib/rsvp/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoginForm } from "./login-form";
import { RsvpEditor } from "./rsvp-editor";
import { DeleteRsvp } from "./delete-rsvp";
import { ShareLinks } from "./share-links";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "RSVPs — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-MY", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kuala_Lumpur",
});

type Props = { searchParams: Promise<{ q?: string | string[] }> };

function matches(r: Rsvp, q: string) {
  const hay = [r.fullName, r.side, ...r.guests, r.dietary, r.message].join(" ").toLowerCase();
  return hay.includes(q);
}

export default async function AdminPage({ searchParams }: Props) {
  if (!isAdminConfigured()) {
    return (
      <Shell>
        <Card className="mx-auto max-w-md border-border/80">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-light">Admin not set up</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Set <code className="rounded bg-muted px-1">ADMIN_PASSWORD</code> (at least 8 characters)
            in your environment and redeploy to enable this page.
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const { q: rawQ } = await searchParams;
  const query = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim().toLowerCase() ?? "";
  const host = databaseHost();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  let all: Rsvp[] = [];
  let loadError: string | undefined;
  try {
    const store = await getRsvpStore();
    all = await store.list();
  } catch (error) {
    console.error("Admin: failed to load RSVPs", error);
    loadError = error instanceof Error ? error.message : "Unknown error";
  }

  const accepting = all.filter((r) => r.attendance === "accept");
  const declining = all.length - accepting.length;
  const totalSeats = accepting.reduce((sum, r) => sum + r.guestCount, 0);
  const seatsFor = (side: Rsvp["side"]) =>
    accepting.filter((r) => r.side === side).reduce((sum, r) => sum + r.guestCount, 0);
  const rsvps = query ? all.filter((r) => matches(r, query)) : all;

  return (
    <Shell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-light">RSVPs</h1>
          {host ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <DatabaseIcon className="size-3.5" />
              Database: {host}
            </p>
          ) : (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
              <TriangleAlertIcon className="size-4" />
              Using the local JSON file. Set DATABASE_URL before going live.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <RsvpEditor />
          <Button asChild variant="outline" className="rounded-full">
            <a href="/admin/export">
              <DownloadIcon className="size-4" />
              Download CSV
            </a>
          </Button>
          <form action={logout}>
            <Button type="submit" variant="ghost" className="rounded-full">
              <LogOutIcon className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {loadError ? (
        <Card className="mt-8 border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4 text-sm">
            <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Could not load RSVPs from the database.</p>
              <p className="mt-1 text-muted-foreground">
                Check DATABASE_URL in Vercel and that the Neon project is awake. Error: {loadError}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Accepting" value={accepting.length} />
        <Stat
          label="Seats reserved"
          value={totalSeats}
          detail={`Bride's side ${seatsFor("bride")} · Groom's side ${seatsFor("groom")}`}
        />
        <Stat label="Declined" value={declining} />
      </div>

      <Card className="mt-8 border-border/80">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-serif text-2xl font-light">
            Responses
            {query ? (
              <span className="ml-2 text-base text-muted-foreground">
                {rsvps.length} of {all.length} match &ldquo;{query}&rdquo;
              </span>
            ) : null}
          </CardTitle>
          <form method="get" className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" defaultValue={query} placeholder="Search names, notes" className="pl-8" />
            </div>
            <Button type="submit" variant="outline" className="rounded-full">
              Search
            </Button>
            {query ? (
              <Button asChild variant="ghost" className="rounded-full">
                <a href="/admin">Clear</a>
              </Button>
            ) : null}
          </form>
        </CardHeader>
        <CardContent className="px-0">
          {rsvps.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              {query
                ? "No responses match that search."
                : "No RSVPs yet. Use Add RSVP for replies you receive outside the website."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[60rem]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Reply</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Additional guests</TableHead>
                    <TableHead className="text-right">Seats</TableHead>
                    <TableHead>Dietary</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Last updated</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvps.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="pl-6 font-medium">{r.fullName}</TableCell>
                      <TableCell>
                        {r.attendance === "accept" ? (
                          <Badge>Accepts</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Declines
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">{r.side}</TableCell>
                      <TableCell>
                        {r.guests.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {r.guests.map((g) => (
                              <Badge key={g} variant="secondary">
                                {g}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{r.guestCount}</TableCell>
                      <TableCell className="max-w-[12rem] whitespace-pre-wrap text-muted-foreground">
                        {r.dietary || "—"}
                      </TableCell>
                      <TableCell className="max-w-xs whitespace-pre-wrap text-muted-foreground">
                        {r.message || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {dateFormat.format(new Date(r.updatedAt))}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end gap-1">
                          <RsvpEditor rsvp={r} />
                          <DeleteRsvp id={r.id} name={r.fullName} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8 border-border/80">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-light">Share links</CardTitle>
        </CardHeader>
        <CardContent>
          <ShareLinks siteUrl={siteUrl} />
        </CardContent>
      </Card>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  );
}

function Stat({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return (
    <Card className="border-border/80">
      <CardContent className="py-2">
        <p className="section-eyebrow">{label}</p>
        <p className="mt-1 font-serif text-4xl">{value}</p>
        {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
