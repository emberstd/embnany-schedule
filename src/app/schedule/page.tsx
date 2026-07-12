import { SchedulePageClient } from "@schedule/components/SchedulePageClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return <SchedulePageClient />;
}
