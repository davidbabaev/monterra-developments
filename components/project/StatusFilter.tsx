"use client";

import { cx } from "@/lib/cx";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/schema";

/**
 * Four pills, each carrying its own count. Counts come from the data, so a
 * status with nothing in it still shows a truthful zero.
 *
 * Real buttons rather than links: the list is already on the page and filtering
 * it is a view change, not a navigation. The URL is kept in step separately so
 * a filtered view stays linkable.
 */

export const ALL_FILTER = "all" as const;
export type StatusFilterValue = ProjectStatus | typeof ALL_FILTER;

export const FILTER_VALUES: readonly StatusFilterValue[] = [
  ALL_FILTER,
  "current",
  "completed",
  "upcoming",
];

const LABEL: Record<StatusFilterValue, string> = {
  all: "All",
  current: "Current",
  completed: "Completed",
  upcoming: "Upcoming",
};

export function isProjectStatus(value: string): value is ProjectStatus {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

type StatusFilterProps = {
  /**
   * The raw value from the URL, not narrowed. An unrecognised one leaves every
   * pill unpressed, which is truthful: no stage is selected.
   */
  readonly selected: string;
  readonly counts: Readonly<Record<StatusFilterValue, number>>;
  readonly onSelect: (value: StatusFilterValue) => void;
};

export function StatusFilter({ selected, counts, onSelect }: StatusFilterProps) {
  return (
    <div role="group" aria-label="Filter projects by stage" className="flex flex-wrap gap-3">
      {FILTER_VALUES.map((value) => {
        const isSelected = value === selected;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(value)}
            className={cx(
              "inline-flex min-h-11 items-center gap-2 rounded-sm px-5",
              "font-display text-[15px] font-medium",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze",
              "motion-safe:transition-colors motion-safe:duration-150",
              isSelected
                ? "bg-navy text-surface"
                : "border border-stone text-navy hover:border-bronze",
            )}
          >
            {LABEL[value]}
            <span className={cx("text-[13px]", isSelected ? "text-stone" : "text-slate")}>
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
