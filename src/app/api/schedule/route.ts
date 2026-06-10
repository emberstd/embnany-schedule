import { NextResponse } from "next/server";
import {
  getScheduleEventsFromNotion,
  isNotionConfigured,
} from "@schedule/lib/notion/getScheduleEvents";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: "Notion is not configured" },
      { status: 503 },
    );
  }

  try {
    const events = await getScheduleEventsFromNotion();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("[API /schedule] Notion fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load schedule from Notion" },
      { status: 500 },
    );
  }
}
