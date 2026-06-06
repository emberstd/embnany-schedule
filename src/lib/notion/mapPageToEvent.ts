import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ScheduleEvent } from "@/types/schedule";
import { isExcludedNotionType } from "@/lib/notion/excludedTypes";
import {
  getDateAndTime,
  getDisplayText,
  getGuests,
  getPlainText,
  getRichTextWithLink,
  getSelectValue,
  getUrl,
} from "@/lib/notion/extractors";
import { notionPropertyNames as props } from "@/lib/notion/propertyConfig";

export function mapNotionPageToEvent(page: PageObjectResponse): ScheduleEvent | null {
  const { properties } = page;

  const eventType = getSelectValue(properties[props.type]);
  if (isExcludedNotionType(eventType)) {
    return null;
  }

  const title = getPlainText(properties[props.title]);
  const { date, time } = getDateAndTime(properties[props.date]);

  if (!title || !date) {
    return null;
  }

  const locationField = getRichTextWithLink(properties[props.location]);
  const location = locationField.text || "TBA";
  const locationUrl = locationField.url;
  const hashtagField = getRichTextWithLink(properties[props.hashtag]);
  const officialUrl =
    getUrl(properties[props.officialUrl]) || "https://example.com";

  return {
    id: page.id,
    date,
    title,
    location,
    locationUrl,
    time,
    guests: getGuests(properties[props.guests]),
    trendingKeyword: getDisplayText(properties[props.trendingKeyword]),
    hashtag: hashtagField.text,
    hashtagUrl: hashtagField.url,
    officialUrl,
  };
}
