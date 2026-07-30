import Image from "next/image";
import { Container } from "./Container";
import { cx } from "@/lib/cx";

/**
 * The offset composition, shared by the homepage's positioning statement, the
 * About story and every stage of Our Process.
 *
 * A stone slab with the photograph translated 40px off it — the
 * `--overlap-offset` figure — so roughly a sixth of the slab shows along two
 * edges. `reverse` mirrors the whole thing, image and offset together, which is
 * what lets Our Process alternate down the page without the offset pointing the
 * wrong way on every other stage.
 *
 * Below 768px the composition collapses completely: an overlap does not survive
 * a 390px column, where it reads as a misplaced block rather than a deliberate
 * one. The slab goes and a 6px bronze rule sits above a full-width image.
 */

export type OffsetImage = {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
};

type OffsetFeatureProps = {
  readonly image: OffsetImage;
  /** Puts the image on the right and mirrors the offset with it. */
  readonly reverse?: boolean;
  /**
   * For the one instance that lands in the first viewport. Everything below the
   * fold stays lazy — this exists because on Our Process the first stage sits
   * just under a 320px hero on a phone and was being discovered late enough to
   * become the LCP.
   */
  readonly priority?: boolean;
  readonly children: React.ReactNode;
};

/** 40px on both axes, mirrored horizontally when the composition flips. */
const OFFSET = {
  forward: "md:translate-x-10 md:translate-y-10",
  reversed: "md:-translate-x-10 md:translate-y-10",
} as const;

/** The padding is the room the translated image moves into, so the slab keeps
    the box's full height instead of being clipped by it. */
const SLAB_ROOM = {
  forward: "md:pb-10 md:pr-10",
  reversed: "md:pb-10 md:pl-10",
} as const;

export function OffsetFeature({
  image,
  reverse = false,
  priority = false,
  children,
}: OffsetFeatureProps) {
  const direction = reverse ? "reversed" : "forward";

  return (
    <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16 xl:gap-20">
      <div className={cx("relative", SLAB_ROOM[direction], reverse && "md:order-2")}>
        <div aria-hidden="true" className="absolute inset-0 hidden bg-stone md:block" />
        <div aria-hidden="true" className="h-1.5 w-full bg-bronze md:hidden" />
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          sizes="(min-width: 768px) 45vw, 100vw"
          className={cx("relative w-full object-cover", OFFSET[direction])}
        />
      </div>

      <div className={cx(reverse && "md:order-1")}>{children}</div>
    </Container>
  );
}
