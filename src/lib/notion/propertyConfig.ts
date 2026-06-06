export const notionPropertyNames = {
  title: process.env.NOTION_PROP_TITLE ?? "Title",
  date: process.env.NOTION_PROP_DATE ?? "Date",
  location: process.env.NOTION_PROP_LOCATION ?? "Location",
  guests: process.env.NOTION_PROP_GUESTS ?? "Guests",
  trendingKeyword:
    process.env.NOTION_PROP_KEYWORD ?? "Trending Keyword",
  hashtag: process.env.NOTION_PROP_HASHTAG ?? "Hashtag",
  officialUrl: process.env.NOTION_PROP_OFFICIAL_URL ?? "Official Post",
  type: process.env.NOTION_PROP_TYPE ?? "Type",
} as const;
