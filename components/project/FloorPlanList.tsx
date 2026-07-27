import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { ResolvedFloorPlan } from "@/lib/project-media";

/**
 * One row per plan: label, thumbnail, and a download only when there is
 * something to download.
 *
 * A plan with no PDF shows the drawing and stops there. A disabled button, or
 * one that resolves to nothing, is worse than no button — the loader already
 * fails the build if a referenced PDF is missing from disk, so `pdf` being
 * absent here means the plan genuinely has no document yet.
 */

type FloorPlanListProps = {
  readonly plans?: readonly ResolvedFloorPlan[];
};

export function FloorPlanList({ plans }: FloorPlanListProps) {
  if (plans === undefined || plans.length === 0) return null;

  return (
    <section>
      <SplitHeading as="h2" lede="Floor" rest="plans" />
      <ul className="mt-8 flex flex-col">
        {plans.map((plan) => (
          <li
            key={plan.label}
            className="flex flex-col gap-4 border-t border-stone py-6 first:border-0 first:pt-0 md:flex-row md:items-center md:gap-8"
          >
            <Image
              src={plan.image.src}
              alt={plan.image.alt}
              width={plan.image.width}
              height={plan.image.height}
              sizes="(min-width: 768px) 200px, 100vw"
              className="w-full border border-stone md:w-[200px]"
            />

            <div className="flex flex-1 flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <h3 className="font-display text-[19px] font-semibold text-navy xl:text-[22px]">
                {plan.label}
              </h3>

              {plan.pdf !== undefined && (
                <Button variant="secondary" href={plan.pdf} newTab>
                  Download PDF
                  {/* Several rows can carry this label, so the accessible name
                      names the plan it belongs to. */}
                  <span className="sr-only"> for {plan.label} (opens in a new tab)</span>
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
