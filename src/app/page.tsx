import { ScheduleView } from "@/components/ScheduleView";
import { SiteFooter } from "@/components/SiteFooter";
import { VideoBackground } from "@/components/VideoBackground";
import { events as mockEvents, profile } from "@/data/mockSchedule";
import {
  getScheduleEventsFromNotion,
  isNotionConfigured,
} from "@/lib/notion/getScheduleEvents";

export default async function Home() {
  let events = mockEvents;
  let dataSource: "notion" | "mock" = "mock";

  if (isNotionConfigured()) {
    try {
      const notionEvents = await getScheduleEventsFromNotion();
      if (notionEvents.length > 0) {
        events = notionEvents;
        dataSource = "notion";
      }
    } catch (error) {
      console.error("[Home] Notion fetch failed, using mock data:", error);
    }
  }

  return (
    <>
      <VideoBackground />
      <main className="relative flex min-h-full flex-1 flex-col">
        {dataSource === "mock" && isNotionConfigured() && (
          <p className="sr-only">
            Notion connected but no events returned; showing mock data.
          </p>
        )}
        <ScheduleView profile={profile} events={events} />
        <SiteFooter />
      </main>
    </>
  );
}
