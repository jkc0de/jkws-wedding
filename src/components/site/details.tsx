import Image from "next/image";
import { CalendarPlusIcon, MapPinIcon, ShirtIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Section } from "./section";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=The+St.+Regis+Kuala+Lumpur";
const WAZE_URL = "https://waze.com/ul?q=The%20St.%20Regis%20Kuala%20Lumpur&navigate=yes";
const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Jordan Koh & Wai Seun's Wedding") +
  "&dates=20270123T100000Z/20270123T150000Z" +
  "&location=" + encodeURIComponent("The St. Regis Kuala Lumpur, No. 6, Jalan Stesen Sentral 2, 50470 Kuala Lumpur") +
  "&details=" + encodeURIComponent("Cocktails at 6:00 PM, dinner at 7:00 PM. Dress code: formal.");

export function Details() {
  return (
    <Section
      id="details"
      eyebrow="The day"
      title="Wedding Details"
      intro="Saturday, 23 January 2027"
      className="bg-white"
    >
      <Card className="mx-auto max-w-xl border-border/80 bg-background">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
          <Image
            src="/st-regis-logo.svg"
            alt="St. Regis"
            width={252}
            height={69}
            className="h-14 w-auto sm:h-16"
          />

          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-light sm:text-4xl">
              The St. Regis Kuala Lumpur
            </h3>
            <p className="flex items-start justify-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                No. 6, Jalan Stesen Sentral 2
                <br />
                Kuala Lumpur Sentral, 50470 Kuala Lumpur
              </span>
            </p>
          </div>

          <Separator className="max-w-24" />

          <div className="flex items-start justify-center gap-10 sm:gap-16">
            <div>
              <p className="section-eyebrow">Cocktails</p>
              <p className="mt-1 font-serif text-3xl">6:00 PM</p>
            </div>
            <div>
              <p className="section-eyebrow">Dinner</p>
              <p className="mt-1 font-serif text-3xl">7:00 PM</p>
            </div>
          </div>

          <Separator className="max-w-24" />

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShirtIcon className="size-4 text-primary" />
            Dress code: Formal / Black tie optional
          </p>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer">
                  Google Maps
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href={WAZE_URL} target="_blank" rel="noreferrer">
                  Waze
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="ghost" className="rounded-full text-primary">
                <a href="/calendar">
                  <CalendarPlusIcon className="size-4" />
                  Add to calendar
                </a>
              </Button>
              <Button asChild variant="ghost" className="rounded-full text-primary">
                <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer">
                  <CalendarPlusIcon className="size-4" />
                  Google Calendar
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
