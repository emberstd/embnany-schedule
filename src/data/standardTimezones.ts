/** Standard 24 equal-timezone options, ordered from UTC+8 (CST) onward. */
export const STANDARD_TIMEZONE_OPTIONS = [
   { id: "Europe/London", label: "GMT/BST - (UTC+0)" },
  { id: "Europe/Paris", label: "CET/CEST - (UTC+1)" },
  { id: "Africa/Cairo", label: "EET/EEST - (UTC+2)" },
  { id: "Europe/Moscow", label: "MSK - (UTC+3)" },
  { id: "Asia/Dubai", label: "GST - (UTC+4)" },
  { id: "Asia/Karachi", label: "PKT - (UTC+5)" },
  { id: "Asia/Dhaka", label: "BST - (UTC+6)" },
  { id: "Asia/Bangkok", label: "ICT - (UTC+7)" },
  { id: "Asia/Shanghai", label: "CST - (UTC+8)" },
  { id: "Asia/Tokyo", label: "JST - (UTC+9)" },
  { id: "Australia/Brisbane", label: "AEST - (UTC+10)" },
  { id: "Australia/Sydney", label: "AEST/AEDT - (UTC+11)" },
  { id: "Pacific/Auckland", label: "NZST/NZDT - (UTC+12)" },
  { id: "Pacific/Midway", label: "SST - (UTC-11)" },
  { id: "America/Honolulu", label: "HST - (UTC-10)" },
  { id: "America/Anchorage", label: "AKST/AKDT - (UTC-9)" },
  { id: "America/Los_Angeles", label: "PST/PDT - (UTC-8)" },
  { id: "America/Denver", label: "MST/MDT - (UTC-7)" },
  { id: "America/Chicago", label: "CST/CDT - (UTC-6)" },
  { id: "America/New_York", label: "EST/EDT - (UTC-5)" },
  { id: "America/Santiago", label: "CLST/CLT - (UTC-4)" },
  { id: "America/Sao_Paulo", label: "BRT - (UTC-3)" },
  { id: "Atlantic/South_Georgia", label: "GST - (UTC-2)" },
  { id: "Atlantic/Azores", label: "AZOT/AZOST - (UTC-1)" },
] as const;

export type StandardTimezoneId = (typeof STANDARD_TIMEZONE_OPTIONS)[number]["id"];

export const STANDARD_TIMEZONE_IDS = STANDARD_TIMEZONE_OPTIONS.map(
  (option) => option.id,
);

export function getStandardTimezoneLabel(timeZoneId: string): string {
  const match = STANDARD_TIMEZONE_OPTIONS.find(
    (option) => option.id === timeZoneId,
  );
  return match?.label ?? timeZoneId.replace(/_/g, " ");
}
