"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { ResolvedFloorPlan, ResolvedGalleryImage } from "@/lib/project-media";
import { Lightbox } from "./Lightbox";

/**
 * One row per plan: label, thumbnail, and a download only when there is
 * something to download.
 *
 * A plan with no PDF shows the drawing and stops there. A disabled button, or
 * one that resolves to nothing, is worse than no button — the loader already
 * fails the build if a referenced PDF is missing from disk, so `pdf` being
 * absent here means the plan genuinely has no document yet.
 *
 * The thumbnail opens the gallery viewer. A floor plan is the only image on the
 * site carrying information rather than atmosphere, and at the 200px the row
 * gives it the room labels are unreadable — so the drawing has to be reachable
 * at full size. This reuses `Lightbox` rather than adding a second viewer, so
 * the keyboard handling, focus trap and focus restore are the ones already
 * tested against the gallery.
 */

type FloorPlanListProps = {
  readonly plans?: readonly ResolvedFloorPlan[];
};

/**
 * The viewer is written against gallery images. A plan's label becomes the
 * caption, which is what names the drawing once it is open — the drawings
 * themselves carry no title.
 */
function toViewerImage(plan: ResolvedFloorPlan): ResolvedGalleryImage {
  return { ...plan.image, caption: plan.label };
}

export function FloorPlanList({ plans }: FloorPlanListProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  /** The thumbnail that opened the viewer, so focus can return to it exactly. */
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  if (plans === undefined || plans.length === 0) return null;

  const open = (index: number, button: HTMLButtonElement) => {
    triggerRef.current = button;
    setOpenAt(index);
  };

  return (
    <section>
      <SplitHeading as="h2" lede="Floor" rest="plans" />
      <ul className="mt-8 flex flex-col">
        {plans.map((plan, index) => (
          <li
            key={plan.label}
            className="flex flex-col gap-4 border-t border-stone py-6 first:border-0 first:pt-0 md:flex-row md:items-center md:gap-8"
          >
            {/*
              A real button, as in the gallery: keyboard-operable and announced
              as a control for free. The name is the plan's label rather than
              its alt — the alt is a room-by-room description several lines
              long, which is right for the image and wrong for a control name.
            */}
            <button
              type="button"
              onClick={(event) => open(index, event.currentTarget)}
              aria-label={`${plan.label} — view larger`}
              className="block w-full border border-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze hover:border-bronze motion-safe:transition-colors motion-safe:duration-[250ms] md:w-[200px]"
            >
              <Image
                src={plan.image.src}
                alt={plan.image.alt}
                width={plan.image.width}
                height={plan.image.height}
                sizes="(min-width: 768px) 200px, 100vw"
                className="w-full"
              />
            </button>

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

      {openAt !== null && (
        <Lightbox
          images={plans.map(toViewerImage)}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
          triggerRef={triggerRef}
        />
      )}
    </section>
  );
}
