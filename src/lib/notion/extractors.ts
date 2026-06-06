import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type PageProperties = PageObjectResponse["properties"];
type PropertyValue = PageProperties[string];

export function getPlainText(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "title") {
    return prop.title.map((item) => item.plain_text).join("").trim();
  }
  if (prop.type === "rich_text") {
    return prop.rich_text.map((item) => item.plain_text).join("").trim();
  }
  return "";
}

/** Text from common Notion field types (title, rich text, select, multi-select, formula). */
export function getDisplayText(prop: PropertyValue | undefined): string {
  if (!prop) return "";

  if (prop.type === "multi_select") {
    return prop.multi_select.map((item) => item.name.trim()).filter(Boolean).join(" / ");
  }

  if (prop.type === "select" && prop.select?.name) {
    return prop.select.name.trim();
  }

  if (prop.type === "formula") {
    const { formula } = prop;
    if (formula.type === "string") return formula.string?.trim() ?? "";
    if (formula.type === "number" && formula.number != null) {
      return String(formula.number);
    }
    return "";
  }

  return getPlainText(prop);
}

export function getSelectValue(prop: PropertyValue | undefined): string {
  if (!prop || prop.type !== "select" || !prop.select?.name) {
    return "";
  }
  return prop.select.name.trim();
}

function linkFromRichTextItem(item: {
  href?: string | null;
  text?: { link?: { url?: string | null } | null };
}): string | undefined {
  const href = item.href?.trim() || item.text?.link?.url?.trim();
  return href || undefined;
}

/** Plain text plus the first embedded link (e.g. Google Maps / stream URL in Location). */
export function getRichTextWithLink(prop: PropertyValue | undefined): {
  text: string;
  url?: string;
} {
  if (!prop || prop.type !== "rich_text") {
    return { text: getPlainText(prop) };
  }

  let url: string | undefined;
  const text = prop.rich_text
    .map((item) => {
      if (!url) {
        url = linkFromRichTextItem(item);
      }
      return item.plain_text;
    })
    .join("")
    .trim();

  return { text, url };
}

export function getDateAndTime(prop: PropertyValue | undefined): {
  date?: string;
  time: string;
} {
  if (!prop || prop.type !== "date" || !prop.date?.start) {
    return { time: "TBA" };
  }

  const start = prop.date.start;
  const date = start.slice(0, 10);

  if (!start.includes("T")) {
    return { date, time: "TBA" };
  }

  const parsed = new Date(start);
  if (Number.isNaN(parsed.getTime())) {
    return { date, time: "TBA" };
  }

  const time = parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
}

export function getUrl(prop: PropertyValue | undefined): string | undefined {
  if (!prop || prop.type !== "url") return undefined;
  const url = prop.url?.trim();
  return url || undefined;
}

export function getGuests(prop: PropertyValue | undefined): string[] {
  if (!prop) return [];

  if (prop.type === "multi_select") {
    return prop.multi_select.map((item) => item.name.trim()).filter(Boolean);
  }

  if (prop.type === "select" && prop.select?.name) {
    return [prop.select.name.trim()].filter(Boolean);
  }

  if (prop.type === "people") {
    return prop.people
      .map((person) => ("name" in person ? person.name?.trim() : undefined))
      .filter((name): name is string => Boolean(name));
  }

  const text = getPlainText(prop);
  if (!text) return [];

  return text
    .split(/\s*\/\s*|\s*,\s*/)
    .map((name) => name.trim())
    .filter(Boolean);
}
