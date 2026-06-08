"use client";

import { PreferredTimezoneProvider } from "@/contexts/PreferredTimezoneContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <PreferredTimezoneProvider>{children}</PreferredTimezoneProvider>;
}
