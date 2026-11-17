"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/lib/profile";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: profile.timezone,
});

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

const getSnapshot = () => formatter.format(new Date()).replace(".", ":");
const getServerSnapshot = () => "--:--";

/** Local time (WIB), refreshed periodically. Renders "--:--" on the server. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <time suppressHydrationWarning>
      {time} {profile.timezoneLabel}
    </time>
  );
}
