"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@schedule/components/icons";

const MONTHS = Array.from({ length: 12 }, (_, i) => i);

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type MonthPickerProps = {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  monthsWithEvents?: Set<string>;
};

function monthKeyFromParts(year: number, month: number) {
  return `${year}-${month}`;
}

export function MonthPicker({
  selected,
  onSelect,
  onClose,
  monthsWithEvents,
}: MonthPickerProps) {
  const [viewYear, setViewYear] = useState(selected.getFullYear());

  useEffect(() => {
    setViewYear(selected.getFullYear());
  }, [selected]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectedYear = selected.getFullYear();
  const selectedMonth = selected.getMonth();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select year and month"
      className="glass-popover absolute top-full left-1/2 z-50 mt-3 w-[min(100vw-2rem,20rem)] -translate-x-1/2 rounded-2xl p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewYear((y) => y - 1)}
          className="glass-button flex h-8 w-8 items-center justify-center rounded-full"
          aria-label="Previous year"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="text-lg font-bold text-white drop-shadow-sm">
          {viewYear}
        </span>
        <button
          type="button"
          onClick={() => setViewYear((y) => y + 1)}
          className="glass-button flex h-8 w-8 items-center justify-center rounded-full"
          aria-label="Next year"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month) => {
          const isSelected =
            viewYear === selectedYear && month === selectedMonth;
          const hasEvents = monthsWithEvents?.has(
            monthKeyFromParts(viewYear, month),
          );

          return (
            <button
              key={month}
              type="button"
              onClick={() => {
                onSelect(new Date(viewYear, month, 1));
                onClose();
              }}
              className={`glass-picker-month relative rounded-xl px-1.5 py-2 text-xs font-semibold leading-tight sm:text-sm${
                isSelected ? " is-selected" : ""
              }`}
            >
              {MONTH_LABELS[month]}
              {hasEvents && !isSelected && (
                <span
                  className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/75"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
