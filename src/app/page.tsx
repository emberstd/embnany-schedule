import { ScheduleView } from "@/components/ScheduleView";
import { SiteFooter } from "@/components/SiteFooter";
import { VideoBackground } from "@/components/VideoBackground";
import { events as mockEvents, profile } from "@/data/mockSchedule";
import {
  getScheduleEventsFromNotion,
  isNotionConfigured,
} from "@/lib/notion/getScheduleEvents";

/** Always fetch fresh Notion data (avoid build-time mock cache on Vercel). */
export const dynamic = "force-dynamic";

export default async function Home() {
  let events = mockEvents;

  if (isNotionConfigured()) {
    try {
      events = await getScheduleEventsFromNotion();
    } catch (error) {
      console.error("[Home] Notion fetch failed:", error);
      events = [];
    }
  }

  return (
    <>
      <VideoBackground />
      <main className="relative flex min-h-dvh flex-col">
        <div className="flex-1">
          <ScheduleView profile={profile} events={events} />
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
