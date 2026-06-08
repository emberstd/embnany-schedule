"use client";

import { useEffect, useState } from "react";

/** Resolves after mount so `navigator.language` is read on the client only. */
export function useNavigatorLocale() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    setLocale(navigator.language || "en");
  }, []);

  return locale;
}
