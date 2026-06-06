import { NextResponse } from "next/server";
import {
  getScheduleEventsFromNotion,
  isNotionConfigured,
} from "@/lib/notion/getScheduleEvents";

/** Always read live env + Notion data (not static at build time). */
export const dynamic = "force-dynamic";

/**
 * Optional JSON API for debugging or client fetch.
 * Token stays on the server — safe for production.
 */
export async function GET() {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        events: [],
        message:
          "Set NOTION_API_KEY and NOTION_DATABASE_ID in Vercel Environment Variables (Production), then Redeploy.",
      },
      { status: 200 },
    );
  }

  try {
    const events = await getScheduleEventsFromNotion();
    return NextResponse.json({
      configured: true,
      eventCount: events.length,
      events,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Notion request failed";
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}
