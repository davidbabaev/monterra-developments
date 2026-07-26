import type { ProjectStatus } from "@/lib/schema";
import { cx } from "@/lib/cx";

/**
 * Status is the only filter in the system, so the badge has to read at a
 * glance and survive small sizes.
 *
 * `current` fills with bronze-deep rather than bronze: white on bronze is
 * 3.87:1 and no palette colour clears 4.5:1 on a bronze fill, so the fill is
 * darkened 10% instead. See the note in app/globals.css.
 */

type StatusBadgeProps = {
  readonly status: ProjectStatus;
  readonly className?: string;
};

const SURFACE: Record<ProjectStatus, string> = {
  completed: "bg-navy text-surface",
  current: "bg-bronze-deep text-surface",
  upcoming: "bg-stone text-navy",
};

const LABEL: Record<ProjectStatus, string> = {
  completed: "Completed",
  current: "Current",
  upcoming: "Upcoming",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm px-2.5 py-1",
        "font-body text-[12px] font-medium uppercase tracking-[0.04em]",
        SURFACE[status],
        className,
      )}
    >
      {LABEL[status]}
    </span>
  );
}
