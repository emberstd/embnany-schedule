"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@schedule/components/icons";
import { MonthPicker } from "@schedule/components/MonthPicker";

type MonthNavigatorProps = {
  label: string;
  selected: Date;
  onPrevious: () => void;
  onNext: () => void;
  onMonthSelect: (date: Date) => void;
  monthsWithEvents?: Set<string>;
};

export function MonthNavigator({
  label,
  selected,
  onPrevious,
  onNext,
  onMonthSelect,
  monthsWithEvents,
}: MonthNavigatorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <nav
      className="relative flex items-center justify-center gap-4"
      aria-label="Month navigation"
    >
      <button
        type="button"
        onClick={onPrevious}
        className="glass-button flex h-11 w-11 items-center justify-center rounded-full"
        aria-label="Previous month"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setPickerOpen((open) => !open)}
        aria-expanded={pickerOpen}
        aria-haspopup="dialog"
        className="glass-button min-w-[9.5rem] rounded-xl px-6 py-3 text-center"
      >
        <span className="text-lg font-bold text-white">{label}</span>
      </button>

      {pickerOpen && (
        <>
          <button
            type="button"
            className="glass-popover-backdrop fixed inset-0 z-40 cursor-default"
            aria-label="关闭日历"
            onClick={() => setPickerOpen(false)}
          />
          <MonthPicker
            selected={selected}
            onSelect={onMonthSelect}
            onClose={() => setPickerOpen(false)}
            monthsWithEvents={monthsWithEvents}
          />
        </>
      )}

      <button
        type="button"
        onClick={onNext}
        className="glass-button flex h-11 w-11 items-center justify-center rounded-full"
        aria-label="Next month"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}
