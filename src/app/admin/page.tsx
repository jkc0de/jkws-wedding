import type { Metadata } from "next";
import { DownloadIcon, LogOutIcon } from "lucide-react";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { databaseUrl, getRsvpStore } from "@/lib/rsvp/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function AdminPage() {
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

  const store = await getRsvpStore();
  const rsvps = await store.list();
  const accepting = rsvps.filter((r) => r.attendance === "accept");
  const declining = rsvps.length - accepting.length;
  const totalSeats = accepting.reduce((sum, r) => sum + r.guestCount, 0);
  const usingDatabase = Boolean(databaseUrl());

  return (
    <Shell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-light">RSVPs</h1>
          {!usingDatabase ? (
            <p className="mt-2 text-sm text-destructive">
              Using the local JSON file. Set DATABASE_URL before going live.
            </p>
          ) : null}
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

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Accepting" value={accepting.length} />
        <Stat label="Seats reserved" value={totalSeats} />
        <Stat label="Declined" value={declining} />
      </div>

      <Card className="mt-8 border-border/80">
        <CardContent className="px-0">
          {rsvps.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No RSVPs yet. Use Add RSVP for replies you receive outside the website.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Reply</TableHead>
                  <TableHead>Additional guests</TableHead>
                  <TableHead className="text-right">Seats</TableHead>
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
          )}
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-border/80">
      <CardContent className="py-2">
        <p className="section-eyebrow">{label}</p>
        <p className="mt-1 font-serif text-4xl">{value}</p>
      </CardContent>
    </Card>
  );
}
