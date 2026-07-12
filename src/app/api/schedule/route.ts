export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getScheduleEventsFromNotion,
  isNotionConfigured,
} from "@schedule/lib/notion/getScheduleEvents";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET() {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: "Notion is not configured" },
      { status: 503, headers: noStoreHeaders },
    );
  }

  try {
    const events = await getScheduleEventsFromNotion();
    return NextResponse.json({ events }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("[API /schedule] Notion fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to load schedule from Notion" },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
