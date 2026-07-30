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
};

/**
 * Approved copy. Three short lines, one per stage — the chips above already name
 * the stage, so this says what the stage means and stops. It no longer takes the
 * project title: the heading and the page around it have said which development
 * this is twice over by the time a reader reaches the line.
 */
const CONTEXT: Record<ProjectStatus, string> = {
  upcoming: "In design. Details to follow.",
  current: "Under construction.",
  completed: "Delivered and sold.",
};

const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 font-body text-[13px] uppercase tracking-[0.04em] md:px-3";

export function StatusTracker({ status }: StatusTrackerProps) {
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

      <p className="mt-4 font-body text-[15px] text-slate">{CONTEXT[status]}</p>
    </section>
  );
}
