const DEFAULT_EXCLUDED_TYPES = ["聊天直播"];

/** Types listed here are not shown on the site (comma-separated in NOTION_EXCLUDE_TYPES). */
export function getExcludedNotionTypes(): Set<string> {
  const raw = process.env.NOTION_EXCLUDE_TYPES?.trim();

  if (raw === "") {
    return new Set();
  }

  if (raw) {
    return new Set(
      raw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    );
  }

  return new Set(DEFAULT_EXCLUDED_TYPES);
}

export function isExcludedNotionType(type: string): boolean {
  const normalized = type.trim();
  if (!normalized) return false;
  return getExcludedNotionTypes().has(normalized);
}
