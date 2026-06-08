import {
  STANDARD_TIMEZONE_IDS,
  getStandardTimezoneLabel,
} from "@/data/standardTimezones";

export const USER_PREFERRED_TIMEZONE_KEY = "user_preferred_timezone";
export const TIMEZONE_CHANGED_EVENT = "timezoneChanged";

export { STANDARD_TIMEZONE_OPTIONS, getStandardTimezoneLabel } from "@/data/standardTimezones";

export function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function isStandardTimezoneId(timeZone: string): boolean {
  return (STANDARD_TIMEZONE_IDS as readonly string[]).includes(timeZone);
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function readStoredPreferredTimeZone(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_PREFERRED_TIMEZONE_KEY)?.trim();
  if (!stored || !isValidIanaTimeZone(stored)) return null;
  return stored;
}

export function writeStoredPreferredTimeZone(timeZone: string | null) {
  if (typeof window === "undefined") return;
  if (timeZone) {
    localStorage.setItem(USER_PREFERRED_TIMEZONE_KEY, timeZone);
  } else {
    localStorage.removeItem(USER_PREFERRED_TIMEZONE_KEY);
  }
  window.dispatchEvent(new Event(TIMEZONE_CHANGED_EVENT));
}

export function resolveDisplayTimeZone(): string {
  return readStoredPreferredTimeZone() ?? getBrowserTimeZone();
}

export function getEffectiveTimezoneLabel(
  preferredTimeZone: string | null,
  effectiveTimeZone: string,
): string {
  if (preferredTimeZone) {
    return getStandardTimezoneLabel(preferredTimeZone);
  }
  return effectiveTimeZone.replace(/_/g, " ");
}
