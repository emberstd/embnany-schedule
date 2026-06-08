import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getTimezoneFromRequest,
  VISITOR_TIMEZONE_COOKIE,
} from "@/utils/visitorTimezone";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const timeZone = getTimezoneFromRequest(request);

  if (timeZone) {
    response.cookies.set(VISITOR_TIMEZONE_COOKIE, timeZone, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};
