"use client";

import {
  ClockIcon,
  MapPinIcon,
  TagHashtagIcon,
  TrendingKeywordIcon,
  UsersIcon,
} from "@/components/icons";
import type { ScheduleEvent } from "@/types/schedule";
import { isPastEventDate } from "@/utils/eventDate";

type EventCardProps = {
  date: string;
  events: ScheduleEvent[];
};

/** Same size as the clock icon on the time row */
const INFO_ICON_CLASS = "h-4 w-4 shrink-0";

const HASHTAG_PILL_CLASS =
  "inline-flex items-center rounded-full border border-white/35 px-3 py-0.5 text-xs font-medium text-white/90";

function splitHashtagTags(raw: string): string[] {
  return raw
    .split(/\s*\/\s*/)
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}

function formatDateParts(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`);
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return { day, month };
}

function EventCardEntry({ event }: { event: ScheduleEvent }) {
  const trendingKeyword = event.trendingKeyword.trim();
  const hashtag = event.hashtag.trim();
  const showTrendingSection = Boolean(trendingKeyword || hashtag);

  const locationContent = event.locationUrl ? (
    <a
      href={event.locationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-white"
    >
      {event.location}
    </a>
  ) : (
    <span>{event.location}</span>
  );

  return (
    <div className="min-w-0">
      <h2 className="text-left text-base font-bold uppercase leading-tight tracking-wide text-white drop-shadow-sm sm:text-lg">
        {event.title}
      </h2>

      <div className="mt-1.5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm leading-snug text-white/75">
          <ClockIcon className={`${INFO_ICON_CLASS} text-white/60`} />
          <span>{event.time}</span>
        </div>

        <div className="flex items-center gap-2 text-sm leading-snug text-white/85">
          <MapPinIcon className={`${INFO_ICON_CLASS} text-white/70`} />
          <p className="min-w-0">{locationContent}</p>
        </div>

        {event.guests.length > 0 ? (
          <div className="flex items-start gap-2 text-sm leading-snug text-white/75">
            <UsersIcon className={`${INFO_ICON_CLASS} mt-0.5 text-white/60`} />
            <p className="min-w-0 uppercase">{event.guests.join(" / ")}</p>
          </div>
        ) : null}
      </div>

      <a
        href={event.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-button official-post-button mt-2 inline-flex w-fit items-center justify-center rounded-full px-4 py-1 text-xs font-semibold"
      >
        Official Post
      </a>

      {showTrendingSection ? (
        <div className="mt-2 space-y-1">
          {trendingKeyword ? (
            <div className="flex items-center gap-2 text-xs leading-snug text-white/80">
              <TrendingKeywordIcon
                className={`${INFO_ICON_CLASS} object-contain`}
              />
              <p className="min-w-0">{trendingKeyword}</p>
            </div>
          ) : null}

            {hashtag ? (
              <div className="flex items-start gap-2 text-xs leading-snug text-white/80">
                <TagHashtagIcon
                  className={`${INFO_ICON_CLASS} mt-0.5 object-contain`}
                />
                <div className="flex min-w-0 flex-wrap gap-1.5">
                  {splitHashtagTags(hashtag).map((tag, index) =>
                    event.hashtagUrl ? (
                      <a
                        key={`${tag}-${index}`}
                        href={event.hashtagUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${HASHTAG_PILL_CLASS} transition hover:border-white/55 hover:bg-white/10`}
                      >
                        {tag}
                      </a>
                    ) : (
                      <span key={`${tag}-${index}`} className={HASHTAG_PILL_CLASS}>
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function EventCard({ date, events }: EventCardProps) {
  const { day, month } = formatDateParts(date);
  const isPast = isPastEventDate(date);

  return (
    <article
      className={`glass-card flex overflow-hidden rounded-3xl${isPast ? " past-event" : ""}`}
      data-past={isPast ? "true" : "false"}
    >
      <div className="glass-date flex w-[4.75rem] shrink-0 flex-col items-center justify-center self-stretch py-4 text-white sm:w-20 sm:py-5">
        <span className="text-3xl font-bold leading-none drop-shadow-sm">
          {day}
        </span>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-white/85">
          {month}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-3.5 sm:p-4">
        {events.map((event) => (
          <EventCardEntry key={event.id} event={event} />
        ))}
      </div>
    </article>
  );
}
