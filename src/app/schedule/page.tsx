import { BackToPortalButton } from "@schedule/components/BackToPortalButton";
import { ScheduleView } from "@schedule/components/ScheduleView";
import { SiteFooter } from "@schedule/components/SiteFooter";
import { TimezoneSelector } from "@schedule/components/TimezoneSelector";
import { VideoBackground } from "@/components/VideoBackground";
import { events as mockEvents, profile } from "@schedule/data/mockSchedule";
import {
  getScheduleEventsFromNotion,
  isNotionConfigured,
} from "@schedule/lib/notion/getScheduleEvents";

/** Always fetch fresh Notion data (avoid build-time mock cache on Vercel). */
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  let events = mockEvents;
  const notionConfigured = isNotionConfigured();
  let notionLoadFailed = false;

  if (notionConfigured) {
    try {
      events = await getScheduleEventsFromNotion();
    } catch (error) {
      console.error("[Schedule] Notion fetch failed:", error);
      events = [];
      notionLoadFailed = true;
    }
  }

  return (
    <>
      <VideoBackground />
      <BackToPortalButton />
      <TimezoneSelector />
      <main className="relative flex min-h-dvh flex-col">
        <div className="flex-1">
          {notionConfigured && events.length === 0 && (
            <p className="mx-auto mb-4 max-w-lg px-4 text-center text-sm text-white/80">
              {notionLoadFailed
                ? "Unable to load events from Notion. Check NOTION_API_KEY, NOTION_DATABASE_ID, and that the database is connected to your integration in Notion."
                : "Notion returned no events. Check your database has rows with Title and Date filled in."}
            </p>
          )}
          <ScheduleView profile={profile} events={events} />
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
