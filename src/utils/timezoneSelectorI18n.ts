export type TimezoneSelectorMessages = {
  auto: string;
  current: string;
  selectTimezone: string;
  closePicker: string;
  timezoneList: string;
};

const MESSAGES: Record<string, TimezoneSelectorMessages> = {
  en: {
    auto: "Auto",
    current: "Current",
    selectTimezone: "Select time zone",
    closePicker: "Close time zone picker",
    timezoneList: "Time zones",
  },
  "zh-Hans": {
    auto: "自动",
    current: "当前",
    selectTimezone: "选择时区",
    closePicker: "关闭时区选择",
    timezoneList: "时区",
  },
  "zh-Hant": {
    auto: "自動",
    current: "目前",
    selectTimezone: "選擇時區",
    closePicker: "關閉時區選擇",
    timezoneList: "時區",
  },
  th: {
    auto: "อัตโนมัติ",
    current: "ปัจจุบัน",
    selectTimezone: "เลือกเขตเวลา",
    closePicker: "ปิดตัวเลือกเขตเวลา",
    timezoneList: "เขตเวลา",
  },
  ja: {
    auto: "自動",
    current: "現在",
    selectTimezone: "タイムゾーンを選択",
    closePicker: "タイムゾーン選択を閉じる",
    timezoneList: "タイムゾーン",
  },
  ko: {
    auto: "자동",
    current: "현재",
    selectTimezone: "시간대 선택",
    closePicker: "시간대 선택 닫기",
    timezoneList: "시간대",
  },
};

function isTraditionalChinese(locale: string): boolean {
  const lower = locale.toLowerCase();
  return (
    lower.includes("hant") ||
    lower.includes("-tw") ||
    lower.includes("-hk") ||
    lower.includes("-mo")
  );
}

/** Map `navigator.language` to the closest supported message bundle. */
export function resolveTimezoneSelectorLocale(locale: string): string {
  const normalized = locale.trim();
  if (!normalized) return "en";

  if (normalized.toLowerCase().startsWith("zh")) {
    return isTraditionalChinese(normalized) ? "zh-Hant" : "zh-Hans";
  }

  const lang = normalized.split("-")[0].toLowerCase();
  if (MESSAGES[lang]) return lang;

  return "en";
}

export function getTimezoneSelectorMessages(
  locale = typeof navigator !== "undefined" ? navigator.language : "en",
): TimezoneSelectorMessages {
  const key = resolveTimezoneSelectorLocale(locale);
  return MESSAGES[key] ?? MESSAGES.en;
}
