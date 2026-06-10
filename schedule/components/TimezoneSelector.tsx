"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { usePreferredTimezone } from "@schedule/contexts/PreferredTimezoneContext";
import { useNavigatorLocale } from "@schedule/hooks/useNavigatorLocale";
import {
  getEffectiveTimezoneLabel,
  STANDARD_TIMEZONE_OPTIONS,
} from "@schedule/utils/preferredTimezone";
import { getTimezoneSelectorMessages } from "@schedule/utils/timezoneSelectorI18n";

export function TimezoneSelector() {
  const { preferredTimeZone, effectiveTimeZone, setPreferredTimeZone } =
    usePreferredTimezone();
  const [open, setOpen] = useState(false);
  const locale = useNavigatorLocale();
  const messages = useMemo(
    () => getTimezoneSelectorMessages(locale),
    [locale],
  );

  const currentLabel = getEffectiveTimezoneLabel(
    preferredTimeZone,
    effectiveTimeZone,
  );

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="region-glass-button flex h-11 w-11 items-center justify-center rounded-full"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={messages.selectTimezone}
        title={messages.selectTimezone}
      >
        <Image
          src="/icons/region-selector.png"
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px] object-contain opacity-95 brightness-0 invert"
          aria-hidden
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="glass-popover-backdrop fixed inset-0 z-40 cursor-default"
            aria-label={messages.closePicker}
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            aria-label={messages.timezoneList}
            className="glass-popover absolute top-full right-0 z-50 mt-3 flex w-[min(100vw-2rem,17.5rem)] flex-col overflow-hidden rounded-2xl"
          >
            <div className="max-h-[min(70vh,26rem)] overflow-y-auto p-2">
              <button
                type="button"
                role="option"
                aria-selected={preferredTimeZone === null}
                onClick={() => {
                  setPreferredTimeZone(null);
                  setOpen(false);
                }}
                className={`glass-picker-month mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm${
                  preferredTimeZone === null ? " is-selected" : ""
                }`}
              >
                {messages.auto}
                <span className="mt-0.5 block text-xs text-white/60">
                  {effectiveTimeZone.replace(/_/g, " ")}
                </span>
              </button>

              {STANDARD_TIMEZONE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={preferredTimeZone === option.id}
                  onClick={() => {
                    setPreferredTimeZone(option.id);
                    setOpen(false);
                  }}
                  className={`glass-picker-month mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm last:mb-0${
                    preferredTimeZone === option.id ? " is-selected" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {preferredTimeZone && (
              <div className="border-t border-white/12 px-3 py-2 text-center text-[11px] text-white/50">
                {messages.current}: {currentLabel}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
