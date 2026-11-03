"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { HeartIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { submitRsvp, type RsvpState } from "@/app/actions/rsvp";
import type { Attendance, Side } from "@/lib/rsvp/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const initialState: RsvpState = { status: "idle" };

export function RsvpForm({ side = "bride" }: { side?: Side }) {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const [attendance, setAttendance] = useState<Attendance>("accept");
  const [guests, setGuests] = useState<string[]>([]);

  const errors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : undefined;

  useEffect(() => {
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  if (state.status === "success") {
    const accepted = state.attendance === "accept";
    const names = [state.fullName, ...state.guests];
    return (
      <Card className="mx-auto max-w-xl border-border/80 text-center">
        <CardHeader className="items-center">
          <HeartIcon className="mx-auto size-8 text-primary" />
          <CardTitle className="font-serif text-3xl font-light">
            Thank you, {state.fullName.split(" ")[0]}
          </CardTitle>
          <CardDescription className="text-base">
            {state.updated
              ? "Your RSVP has been updated."
              : accepted
                ? "We can’t wait to celebrate with you."
                : "We’ll miss you, but thank you for letting us know."}
          </CardDescription>
        </CardHeader>
        {accepted ? (
          <CardContent>
            <p className="section-eyebrow">
              {names.length === 1 ? "Seat reserved for" : `${names.length} seats reserved for`}
            </p>
            <ul className="mt-3 space-y-1 font-serif text-xl">
              {names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </Card>
    );
  }

  const updateGuest = (i: number, value: string) =>
    setGuests((g) => g.map((name, idx) => (idx === i ? value : name)));
  const removeGuest = (i: number) => setGuests((g) => g.filter((_, idx) => idx !== i));
  const addGuest = () => setGuests((g) => [...g, ""]);
  const accepting = attendance === "accept";

  return (
    <Card className="relative mx-auto max-w-xl border-border/80">
      <CardHeader>
        <CardTitle className="font-serif text-3xl font-light">Will you join us?</CardTitle>
        <CardDescription>
          Kindly respond by 1st December 2026. Need to change something later? Submit again with
          the same name and we will update your RSVP.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6" noValidate>
          {/* Honeypot: hidden from people, filled in by bots */}
          <div aria-hidden className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <input type="hidden" name="side" value={side} />

          <Field label="Your name" htmlFor="fullName" error={errors.fullName}>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              defaultValue={values?.fullName}
              aria-invalid={Boolean(errors.fullName)}
              placeholder="Full name"
            />
          </Field>

          <Field label="Will you be attending?" error={errors.attendance}>
            <RadioGroup
              name="attendance"
              value={attendance}
              onValueChange={(v) => setAttendance(v as Attendance)}
              className="grid gap-3 sm:grid-cols-2"
            >
              <RadioCard
                id="attendance-accept"
                value="accept"
                title="Joyfully accept"
                description="Count me in"
              />
              <RadioCard
                id="attendance-decline"
                value="decline"
                title="Regretfully decline"
                description="Sorry to miss it"
              />
            </RadioGroup>
          </Field>

          {accepting ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Coming with anyone?</Label>
                <p className="text-xs text-muted-foreground">Add everyone in your party</p>
              </div>

              {guests.map((guest, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    name="guests"
                    value={guest}
                    onChange={(e) => updateGuest(i, e.target.value)}
                    aria-label={`Guest ${i + 2} name`}
                    aria-invalid={Boolean(errors.guests) && guest.trim().length < 2}
                    placeholder={`Guest ${i + 2} full name`}
                    autoFocus={guest === ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGuest(i)}
                    aria-label={`Remove guest ${i + 2}`}
                    className="shrink-0 rounded-full text-muted-foreground hover:text-destructive"
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              ))}

              {errors.guests ? <p className="text-sm text-destructive">{errors.guests}</p> : null}

              <Button type="button" variant="outline" onClick={addGuest} className="rounded-full">
                <PlusIcon className="size-4" />
                Add a guest
              </Button>
            </div>
          ) : null}

          {accepting ? (
            <Field
              label="Dietary restrictions & allergies"
              htmlFor="dietary"
              error={errors.dietary}
              optional
            >
              <Textarea
                id="dietary"
                name="dietary"
                defaultValue={values?.dietary}
                placeholder="Vegetarian, halal, nut allergy, etc."
                rows={2}
              />
            </Field>
          ) : null}

          <Field label="A note for the couple" htmlFor="message" error={errors.message} optional>
            <Textarea
              id="message"
              name="message"
              defaultValue={values?.message}
              placeholder="Anything you'd like to share"
              rows={3}
            />
          </Field>

          <Button type="submit" disabled={pending} className="h-11 w-full rounded-full text-base">
            {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {pending
              ? "Sending"
              : !accepting || guests.length === 0
                ? "Send RSVP"
                : `Send RSVP for ${guests.length + 1} guests`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="flex items-baseline gap-2">
        {label}
        {optional ? <span className="text-xs font-normal text-muted-foreground">Optional</span> : null}
      </Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function RadioCard({
  id,
  value,
  title,
  description,
}: {
  id: string;
  value: string;
  title: string;
  description: string;
}) {
  return (
    <Label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
    >
      <RadioGroupItem id={id} value={value} className="mt-0.5" />
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">{title}</span>
        <span className="text-xs font-normal text-muted-foreground">{description}</span>
      </span>
    </Label>
  );
}
