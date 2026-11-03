"use client";

import { useSyncExternalStore } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number, now: number): Parts | null {
  const ms = target - now;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Ticks once per second; snapshot is the current time rounded to the second. */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getNow = () => Math.floor(Date.now() / 1000) * 1000;
const getServerNow = () => null;

export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const parts = now === null ? undefined : diff(targetMs, now);

  if (parts === null) {
    return <p className="font-serif text-2xl italic text-primary">Today is the day.</p>;
  }

  const items: Array<[string, number | undefined]> = [
    ["Days", parts?.days],
    ["Hours", parts?.hours],
    ["Minutes", parts?.minutes],
    ["Seconds", parts?.seconds],
  ];

  return (
    <div className="flex items-start justify-center gap-6 sm:gap-10" aria-live="polite">
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-serif text-4xl tabular-nums text-primary sm:text-5xl">
            {value === undefined ? "--" : String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
