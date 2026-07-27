import type { ProjectStatus } from "./schema";

/**
 * How a status is worded and sequenced when it is shown to a reader.
 *
 * Kept out of schema.ts, which is validation only, and out of StatusBadge, which
 * is one of four places that render this wording — the badge, the spec table,
 * the filter and the status tracker all read it from here so they cannot drift.
 */

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  completed: "Completed",
  current: "Current",
  upcoming: "Upcoming",
};

/**
 * Lifecycle order, which is not the order `PROJECT_STATUSES` declares. That one
 * exists for validation; this one is the sequence a development actually moves
 * through, and the status tracker renders it left to right.
 */
export const STATUS_LIFECYCLE: readonly ProjectStatus[] = ["upcoming", "current", "completed"];
