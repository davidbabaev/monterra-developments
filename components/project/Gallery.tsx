"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { ResolvedGalleryImage } from "@/lib/project-media";
import { Lightbox } from "./Lightbox";

/**
 * The gallery grid, and the state of which image the viewer is showing.
 *
 * A project with no gallery renders nothing — no heading, no empty grid.
 * Monterra Bay has none, so its page skips this section entirely.
 *
 * Each thumbnail is a real button, so it is keyboard-operable and announced as a
 * control for free. Its accessible name is the image's own description rather
 * than a generic "open gallery", which would leave twelve identical controls.
 */

type GalleryProps = {
  readonly images?: readonly ResolvedGalleryImage[];
};

/** 3 columns from 1280px, 2 from 768px, 1 below — the ProjectGrid rhythm. */
const GRID = "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8";

export function Gallery({ images }: GalleryProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  /** The thumbnail that opened the viewer, so focus can return to it exactly. */
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  if (images === undefined || images.length === 0) return null;

  const open = (index: number, button: HTMLButtonElement) => {
    triggerRef.current = button;
    setOpenAt(index);
  };

  return (
    <section>
      <SplitHeading as="h2" lede="Project" rest="gallery" />

      <ul className={`mt-8 ${GRID}`}>
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={(event) => open(index, event.currentTarget)}
              aria-label={`${image.alt} — view larger`}
              className="group block w-full overflow-hidden rounded-md border border-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze hover:border-bronze motion-safe:transition-colors motion-safe:duration-[250ms]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1280px) 336px, (min-width: 768px) 50vw, 100vw"
                className="aspect-[3/2] w-full object-cover motion-safe:transition-transform motion-safe:duration-[250ms] motion-safe:group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {openAt !== null && (
        <Lightbox
          images={images}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
          triggerRef={triggerRef}
        />
      )}
    </section>
  );
}
