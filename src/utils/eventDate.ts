import type { DayScheduleGroup, ScheduleEvent } from "@/types/schedule";

export function parseEventDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

/** Minutes from midnight for sorting; unknown/TBA sorts last. */
export function parseEventTimeMinutes(time: string): number {
  const trimmed = time.trim();
  if (!trimmed || trimmed.toUpperCase() === "TBA") {
    return Number.POSITIVE_INFINITY;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return Number.POSITIVE_INFINITY;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function sortEventsByTime(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => {
    const aMs = a.startsAt
      ? new Date(a.startsAt).getTime()
      : parseEventTimeMinutes(a.time);
    const bMs = b.startsAt
      ? new Date(b.startsAt).getTime()
      : parseEventTimeMinutes(b.time);
    return aMs - bMs;
  });
}

/** One card per calendar day; events inside are ordered by time. */
export function groupEventsByDate(events: ScheduleEvent[]): DayScheduleGroup[] {
  const byDate = new Map<string, ScheduleEvent[]>();
  const dateOrder: string[] = [];

  for (const event of events) {
    if (!byDate.has(event.date)) {
      dateOrder.push(event.date);
      byDate.set(event.date, []);
    }
    byDate.get(event.date)!.push(event);
  }

  return dateOrder.map((date) => ({
    date,
    events: sortEventsByTime(byDate.get(date)!),
  }));
}

export function isPastEventDate(isoDate: string) {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return parseEventDate(isoDate).getTime() < todayStart.getTime();
}
