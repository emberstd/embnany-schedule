"use client";

import { useEffect, useState } from "react";
import { resolveVisitorTimeZone } from "@/utils/visitorTimezone";

/**
 * Resolves the visitor timezone on the client only (IP cookie + device clock).
 * Returns null until mounted so we never render Vercel's UTC server time.
 */
export function useVisitorTimezone() {
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    setTimeZone(resolveVisitorTimeZone());
  }, []);

  return timeZone;
}
