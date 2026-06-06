export type ScheduleEvent = {
  id: string;
  date: string;
  title: string;
  location: string;
  locationUrl?: string;
  time: string;
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
