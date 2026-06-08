/** Capital / primary timezone by ISO country code (from visitor IP on Vercel). */
const COUNTRY_CAPITAL_TIMEZONES: Record<string, string> = {
  CN: "Asia/Shanghai",
  TH: "Asia/Bangkok",
  KR: "Asia/Seoul",
  JP: "Asia/Tokyo",
  SG: "Asia/Singapore",
  HK: "Asia/Hong_Kong",
  MO: "Asia/Macau",
  TW: "Asia/Taipei",
  VN: "Asia/Ho_Chi_Minh",
  PH: "Asia/Manila",
  MY: "Asia/Kuala_Lumpur",
  ID: "Asia/Jakarta",
  IN: "Asia/Kolkata",
  FR: "Europe/Paris",
  IT: "Europe/Rome",
  DE: "Europe/Berlin",
  GB: "Europe/London",
  US: "America/New_York",
  AU: "Australia/Sydney",
};

const VISITOR_TIMEZONE_COOKIE = "visitor-timezone";

export function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getDeviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function readVisitorTimezoneCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${VISITOR_TIMEZONE_COOKIE}=([^;]*)`),
  );
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return isValidIanaTimeZone(value) ? value : null;
}

/** Prefer IP-derived cookie, then the device system timezone. */
export function resolveVisitorTimeZone(): string {
  return readVisitorTimezoneCookie() ?? getDeviceTimeZone();
}

type GeoRequest = {
  headers: { get(name: string): string | null };
  geo?: { country?: string };
};

/** Infer visitor timezone from Vercel IP headers / geo (used in middleware). */
export function getTimezoneFromRequest(request: GeoRequest): string | null {
  const headerTz = request.headers.get("x-vercel-ip-timezone")?.trim();
  if (headerTz && isValidIanaTimeZone(headerTz)) {
    return headerTz;
  }

  const country = request.geo?.country?.toUpperCase();
  if (country && COUNTRY_CAPITAL_TIMEZONES[country]) {
    return COUNTRY_CAPITAL_TIMEZONES[country];
  }

  return null;
}

export { VISITOR_TIMEZONE_COOKIE };
