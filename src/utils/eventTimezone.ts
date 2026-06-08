/**
 * Event time pipeline:
 * 1. Read flag emoji at the start of Title → event timezone (capital / major city).
 * 2. Treat Notion Date date+time as wall-clock in that timezone.
 * 3. Convert to UTC and store as `startsAt`.
 * 4. On the card, format `startsAt` in the visitor's browser-local timezone.
 */

/** When Title has no flag emoji. */
export const DEFAULT_EVENT_TIMEZONE = "Asia/Shanghai";

/** Flag emoji at Title start → IANA timezone (capital / primary city). */
export const FLAG_TIMEZONES: Record<string, string> = {
  "🇹🇭": "Asia/Bangkok",
  "🇨🇳": "Asia/Shanghai",
  "🇭🇰": "Asia/Hong_Kong",
  "🇲🇴": "Asia/Macau",
  "🇹🇼": "Asia/Taipei",
  "🇰🇷": "Asia/Seoul",
  "🇯🇵": "Asia/Tokyo",
  "🇸🇬": "Asia/Singapore",
  "🇵🇭": "Asia/Manila",
  "🇻🇳": "Asia/Ho_Chi_Minh",
  "🇫🇷": "Europe/Paris",
  "🇮🇹": "Europe/Rome",
  "🇬🇧": "Europe/London",
  "🇩🇪": "Europe/Berlin",
  "🇺🇸": "America/New_York",
  "🇦🇺": "Australia/Sydney",
};

const TITLE_FLAG_PATTERN = /^(\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF])\s*/;

export function getEventTimeZoneFromTitle(title: string): string {
  const match = title.match(TITLE_FLAG_PATTERN);
  if (!match) return DEFAULT_EVENT_TIMEZONE;
  return FLAG_TIMEZONES[match[1]] ?? DEFAULT_EVENT_TIMEZONE;
}

function formatTime12h(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function parseNotionWallClock(notionStart: string) {
  const dateOnly = notionStart.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnly) {
    return { date: dateOnly[1], hasTime: false as const };
  }

  const withTime = notionStart.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
  if (!withTime) {
    return { date: notionStart.slice(0, 10), hasTime: false as const };
  }

  return {
    date: withTime[1],
    hour: Number.parseInt(withTime[2], 10),
    minute: Number.parseInt(withTime[3], 10),
    hasTime: true as const,
  };
}

/** Wall-clock in `timeZone` → UTC instant. */
function zonedLocalToUtc(
  isoDate: string,
  hour24: number,
  minute: number,
  timeZone: string,
): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  const desiredUtc = Date.UTC(year, month - 1, day, hour24, minute, 0);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  let ms = desiredUtc;
  for (let i = 0; i < 4; i++) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(ms)).map((part) => [part.type, part.value]),
    );
    const shownUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    ms += desiredUtc - shownUtc;
  }

  return new Date(ms);
}

/** Format UTC instant in the visitor's chosen or browser-local timezone. */
export function formatEventTimeInBrowserLocal(
  startsAt: string | undefined,
  fallback = "TBA",
  timeZone?: string,
): string {
  if (!startsAt) return fallback;
  const instant = new Date(startsAt);
  if (Number.isNaN(instant.getTime())) return fallback;

  return instant.toLocaleTimeString(undefined, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function parseEventDateTimeFromNotion(
  notionStart: string | undefined,
  title: string,
): {
  date?: string;
  time: string;
  startsAt?: string;
  eventTimeZone?: string;
} {
  if (!notionStart) {
    return { time: "TBA" };
  }

  const eventTimeZone = getEventTimeZoneFromTitle(title);
  const wallClock = parseNotionWallClock(notionStart);

  if (!wallClock.hasTime) {
    return { date: wallClock.date, time: "TBA", eventTimeZone };
  }

  const instant = zonedLocalToUtc(
    wallClock.date,
    wallClock.hour,
    wallClock.minute,
    eventTimeZone,
  );

  return {
    date: wallClock.date,
    time: formatTime12h(wallClock.hour, wallClock.minute),
    startsAt: instant.toISOString(),
    eventTimeZone,
  };
}
