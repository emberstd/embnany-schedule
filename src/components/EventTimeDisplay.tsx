"use client";

import { useVisitorTimezone } from "@/hooks/useVisitorTimezone";
import { formatEventTimeLocal } from "@/utils/eventTimezone";

type EventTimeDisplayProps = {
  startsAt?: string;
  fallback: string;
};

export function EventTimeDisplay({ startsAt, fallback }: EventTimeDisplayProps) {
  const visitorTimeZone = useVisitorTimezone();

  if (!visitorTimeZone) {
    return <span className="text-white/40">…</span>;
  }

  return (
    <span>{formatEventTimeLocal(startsAt, fallback, visitorTimeZone)}</span>
  );
}
