import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The gallery's place in the page order, held open for increment 7, which builds
 * the grid and the lightbox.
 *
 * It follows the same rule as every other optional section: a project with no
 * gallery renders nothing here. Monterra Bay has none, so its page skips this
 * entirely rather than showing an empty frame.
 */

type GallerySlotProps = {
  readonly imageCount: number;
};

export function GallerySlot({ imageCount }: GallerySlotProps) {
  if (imageCount === 0) return null;

  return (
    <section>
      <SplitHeading as="h2" lede="Project" rest="gallery" />
      <div className="mt-8 border border-dashed border-stone p-6 xl:p-8">
        <p className="font-body text-[16px] text-ink xl:text-[17px]">
          [REPLACE — increment 7] {imageCount} images are ready for this project. The grid and its
          lightbox are built next; this panel marks where they go.
        </p>
      </div>
    </section>
  );
}
