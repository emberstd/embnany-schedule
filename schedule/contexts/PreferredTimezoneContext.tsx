"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getBrowserTimeZone,
  readStoredPreferredTimeZone,
  resolveDisplayTimeZone,
  TIMEZONE_CHANGED_EVENT,
  writeStoredPreferredTimeZone,
} from "@schedule/utils/preferredTimezone";

type PreferredTimezoneContextValue = {
  /** User override from localStorage; null = follow browser/system. */
  preferredTimeZone: string | null;
  /** Timezone used for rendering event times. */
  effectiveTimeZone: string;
  setPreferredTimeZone: (timeZone: string | null) => void;
};

const PreferredTimezoneContext =
  createContext<PreferredTimezoneContextValue | null>(null);

export function PreferredTimezoneProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferredTimeZone, setPreferredState] = useState<string | null>(null);
  const [effectiveTimeZone, setEffectiveTimeZone] = useState("UTC");

  const syncFromStorage = useCallback(() => {
    setPreferredState(readStoredPreferredTimeZone());
    setEffectiveTimeZone(resolveDisplayTimeZone());
  }, []);

  useEffect(() => {
    syncFromStorage();

    const handleChange = () => syncFromStorage();
    window.addEventListener(TIMEZONE_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(TIMEZONE_CHANGED_EVENT, handleChange);
  }, [syncFromStorage]);

  const setPreferredTimeZone = useCallback((timeZone: string | null) => {
    writeStoredPreferredTimeZone(timeZone);
    setPreferredState(timeZone);
    setEffectiveTimeZone(timeZone ?? getBrowserTimeZone());
  }, []);

  const value = useMemo(
    () => ({ preferredTimeZone, effectiveTimeZone, setPreferredTimeZone }),
    [preferredTimeZone, effectiveTimeZone, setPreferredTimeZone],
  );

  return (
    <PreferredTimezoneContext.Provider value={value}>
      {children}
    </PreferredTimezoneContext.Provider>
  );
}

export function usePreferredTimezone() {
  const context = useContext(PreferredTimezoneContext);
  if (!context) {
    throw new Error(
      "usePreferredTimezone must be used within PreferredTimezoneProvider",
    );
  }
  return context;
}
