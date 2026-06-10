"use client";

import { useEffect, useState } from "react";
import { usePreferredTimezone } from "@schedule/contexts/PreferredTimezoneContext";
import { formatEventTimeInBrowserLocal } from "@schedule/utils/eventTimezone";

type EventTimeDisplayProps = {
  startsAt?: string;
  fallback: string;
};

/**
 * Renders event time in the user's preferred timezone (localStorage override)
 * or the browser system timezone. Client-only to avoid Vercel UTC SSR mismatch.
 */
export function EventTimeDisplay({ startsAt, fallback }: EventTimeDisplayProps) {
  const { effectiveTimeZone } = usePreferredTimezone();
  const [displayTime, setDisplayTime] = useState(fallback);

  useEffect(() => {
    setDisplayTime(
      formatEventTimeInBrowserLocal(startsAt, fallback, effectiveTimeZone),
    );
  }, [startsAt, fallback, effectiveTimeZone]);

  return <span suppressHydrationWarning>{displayTime}</span>;
}
