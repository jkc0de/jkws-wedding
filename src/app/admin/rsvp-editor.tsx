"use client";

import { useActionState, useState } from "react";
import { Loader2Icon, PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { Rsvp } from "@/lib/rsvp/schema";
import { saveRsvpAsAdmin, type AdminRsvpState } from "./rsvp-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const initial: AdminRsvpState = { status: "idle" };

/** Add (no `rsvp`) or edit (with `rsvp`) a response from the admin page. */
export function RsvpEditor({ rsvp }: { rsvp?: Rsvp }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    async (prev: AdminRsvpState, formData: FormData) => {
      const result = await saveRsvpAsAdmin(prev, formData);
      if (result.status === "saved") {
        toast.success(rsvp ? "RSVP updated." : "RSVP added.");
        setOpen(false);
      }
      return result;
    },
    initial,
  );

  const editing = Boolean(rsvp);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editing ? (
          <Button variant="ghost" size="icon" aria-label={`Edit ${rsvp?.fullName}`} className="rounded-full">
            <PencilIcon className="size-4" />
          </Button>
        ) : (
          <Button className="rounded-full">
            <PlusIcon className="size-4" />
            Add RSVP
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light">
            {editing ? "Edit RSVP" : "Add RSVP"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Changes are saved straight to the guest list."
              : "For replies you receive outside the website. Adding a name that already exists updates that RSVP."}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5">
          {rsvp ? <input type="hidden" name="id" value={rsvp.id} /> : null}

          <div className="space-y-2">
            <Label htmlFor="admin-fullName">Name</Label>
            <Input id="admin-fullName" name="fullName" defaultValue={rsvp?.fullName} required autoFocus />
          </div>

          <div className="space-y-2">
            <Label>Reply</Label>
            <RadioGroup name="attendance" defaultValue={rsvp?.attendance ?? "accept"} className="flex gap-6">
              <Label htmlFor="admin-accept" className="flex items-center gap-2 font-normal">
                <RadioGroupItem id="admin-accept" value="accept" />
                Accepts
              </Label>
              <Label htmlFor="admin-decline" className="flex items-center gap-2 font-normal">
                <RadioGroupItem id="admin-decline" value="decline" />
                Declines
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-guests">Additional guests</Label>
            <Textarea
              id="admin-guests"
              name="guests"
              defaultValue={rsvp?.guests.join("\n")}
              placeholder="One name per line"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Ignored if the reply is a decline.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-dietary">Dietary restrictions &amp; allergies</Label>
            <Textarea id="admin-dietary" name="dietary" defaultValue={rsvp?.dietary} rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-message">Note</Label>
            <Textarea id="admin-message" name="message" defaultValue={rsvp?.message} rows={2} />
          </div>

          {state.status === "error" ? <p className="text-sm text-destructive">{state.message}</p> : null}

          <DialogFooter>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="rounded-full">
              {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
              {editing ? "Save changes" : "Add RSVP"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
