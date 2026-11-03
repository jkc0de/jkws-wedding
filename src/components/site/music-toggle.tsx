"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Background music: Pachelbel's Canon in D, performed by the
 * United States Air Force Strolling Strings (public domain).
 *
 * Plays by default. Browsers refuse to start audio before the visitor's first
 * tap, click or key press, so we try immediately and again on the first
 * gesture the browser accepts as "user activation".
 */
const TRACK_SRC = "/audio/canon-in-d.m4a";
const STORAGE_KEY = "wedding-music-muted";

// Events that count as user activation across Chrome, Safari and Firefox.
const ACTIVATION_EVENTS = ["pointerdown", "pointerup", "touchend", "mousedown", "click", "keydown"] as const;

function readMuted() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  } catch {
    // ignore
  }
}

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || readMuted()) return;

    const tryPlay = () => audio.play().catch(() => undefined);
    const stop = () => ACTIVATION_EVENTS.forEach((e) => window.removeEventListener(e, onGesture, true));
    const onGesture = () => {
      tryPlay().then(() => {
        if (!audio.paused) stop();
      });
    };

    tryPlay();
    ACTIVATION_EVENTS.forEach((e) => window.addEventListener(e, onGesture, true));

    // Some browsers allow playback once the tab becomes visible again.
    const onVisible = () => {
      if (document.visibilityState === "visible" && audio.paused && !readMuted()) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      writeMuted(true);
    } else {
      writeMuted(false);
      audio.play().catch(() => undefined);
    }
  };

  if (unavailable) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        autoPlay
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setUnavailable(true)}
      />
      <Button
        type="button"
        variant={playing ? "ghost" : "outline"}
        size="icon"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Mute music" : "Play music"}
        title={playing ? "Mute music" : "Play music"}
        className={
          playing
            ? "rounded-full text-primary hover:bg-accent"
            : "rounded-full border-primary/40 text-primary hover:bg-accent"
        }
      >
        {playing ? <Volume2Icon className="size-4" /> : <VolumeXIcon className="size-4" />}
      </Button>
    </>
  );
}
