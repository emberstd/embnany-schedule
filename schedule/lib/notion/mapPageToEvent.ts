import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ScheduleEvent } from "@schedule/types/schedule";
import {
  getDisplayText,
  getGuests,
  getPlainText,
  getRichTextWithLink,
  getUrl,
} from "@schedule/lib/notion/extractors";
import { parseEventDateTimeFromNotion } from "@schedule/utils/eventTimezone";
import { notionPropertyNames as props } from "@schedule/lib/notion/propertyConfig";

export function mapNotionPageToEvent(page: PageObjectResponse): ScheduleEvent | null {
  const { properties } = page;

  const title = getPlainText(properties[props.title]);
  const locationField = getRichTextWithLink(properties[props.location]);
  const location = locationField.text || "TBA";
  const locationUrl = locationField.url;

  const dateProp = properties[props.date];
  const notionStart =
    dateProp?.type === "date" ? dateProp.date?.start : undefined;
  const { date, time, startsAt, eventTimeZone } = parseEventDateTimeFromNotion(
    notionStart,
    title,
  );

  if (!title || !date) {
    return null;
  }
  const hashtagField = getRichTextWithLink(properties[props.hashtag]);
  const officialUrl = getUrl(properties[props.officialUrl]) ?? "";

  return {
    id: page.id,
    date,
    title,
    location,
    locationUrl,
    time,
    startsAt,
    eventTimeZone,
    guests: getGuests(properties[props.guests]),
    trendingKeyword: getDisplayText(properties[props.trendingKeyword]),
    hashtag: hashtagField.text,
    hashtagUrl: hashtagField.url,
    officialUrl,
  };
}
