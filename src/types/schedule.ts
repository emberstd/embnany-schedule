export type ScheduleEvent = {
  id: string;
  date: string;
  title: string;
  location: string;
  locationUrl?: string;
  time: string;
  /** UTC ISO instant; used for local-time display and sorting. */
  startsAt?: string;
  /** IANA timezone inferred from the flag emoji at the start of Title. */
  eventTimeZone?: string;
  guests: string[];
  trendingKeyword: string;
  hashtag: string;
  hashtagUrl?: string;
  officialUrl: string;
};

export type DayScheduleGroup = {
  date: string;
  events: ScheduleEvent[];
};

export type CelebrityProfile = {
  name: string;
  subtitle: string;
  avatarSrc: string;
  /** CSS object-position for the circular avatar crop, e.g. "58% center" */
  avatarPosition?: string;
};
