import { SplitHeading } from "@/components/ui/SplitHeading";
import { cx } from "@/lib/cx";
import { STATUS_LABEL, STATUS_LIFECYCLE } from "@/lib/project-status";
import type { ProjectStatus } from "@/lib/schema";

/**
 * Where the development sits in its lifecycle: upcoming, current, completed.
 *
 * Colour is never the only cue. The active stage is a filled chip against two
 * outlined ones, its marker is solid where theirs are hollow, its label is
 * heavier, it carries `aria-current="step"` and a visually hidden "current
 * stage", and the line beneath names the stage in words. Turn the page
 * greyscale and every one of those survives.
 */

type StatusTrackerProps = {
  readonly status: ProjectStatus;
  readonly title: string;
};

const CONTEXT: Record<ProjectStatus, (title: string) => string> = {
  upcoming: (title) =>
    `[REPLACE] ${title} is in planning. We publish unit counts and dates once the design is approved.`,
  current: (title) =>
    `[REPLACE] ${title} is under construction, with homes handed over as each phase completes.`,
  completed: (title) => `[REPLACE] ${title} is finished, handed over and fully sold.`,
};

const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 font-body text-[13px] uppercase tracking-[0.04em] md:px-3";

export function StatusTracker({ status, title }: StatusTrackerProps) {
  return (
    <section>
      <SplitHeading as="h2" lede="Development" rest="status" />

      {/* The three stages do not hold one line at 390px, so they wrap. The
          connecting rules are dropped below 768px: a wrapped line would open
          with an orphan dash, and order alone carries the sequence there. */}
      <ol className="mt-8 flex flex-wrap items-center gap-2 md:gap-3">
        {STATUS_LIFECYCLE.map((stage, index) => {
          const isActive = stage === status;

          return (
            <li key={stage} className="flex items-center gap-2 md:gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="hidden h-px bg-stone md:block md:w-10" />
              )}

              <span
                {...(isActive ? { "aria-current": "step" as const } : {})}
                className={cx(
                  CHIP_BASE,
                  isActive
                    ? "bg-bronze-deep font-semibold text-surface"
                    : "border border-stone font-medium text-navy",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "h-2 w-2 rounded-full",
                    isActive ? "bg-surface" : "border border-navy",
                  )}
                />
                {STATUS_LABEL[stage]}
                {isActive && <span className="sr-only"> — current stage</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 font-body text-[15px] text-slate">{CONTEXT[status](title)}</p>
    </section>
  );
}
