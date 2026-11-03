"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareLinks({ siteUrl }: { siteUrl: string }) {
  const links = [
    { label: "Bride's side (bride first)", url: `${siteUrl}/` },
    { label: "Groom's side (groom first)", url: `${siteUrl}/?g` },
    { label: "RSVP page", url: `${siteUrl}/rsvp` },
  ];
  return (
    <ul className="divide-y divide-border/60">
      {links.map((l) => (
        <li key={l.url} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">{l.label}</p>
            <p className="truncate text-xs text-muted-foreground">{l.url}</p>
          </div>
          <CopyButton value={l.url} />
        </li>
      ))}
    </ul>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 rounded-full"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          window.prompt("Copy this link", value);
        }
      }}
    >
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
