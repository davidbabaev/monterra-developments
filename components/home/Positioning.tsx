import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

/**
 * The offset composition: a stone slab with the photograph translated down and
 * right of it, so roughly a sixth of the slab shows along the top and left
 * edges. The offset is the `--overlap-offset` token, 40px, the same figure the
 * design reference gives.
 *
 * Below 768px the composition collapses completely. An overlap does not survive
 * a 390px column — it reads as a misplaced block rather than a deliberate one —
 * so the slab is replaced by a 6px bronze rule above a full-width image.
 *
 * The statement is the page's one editorial moment outside a heading lede.
 */

/** 40px, matching --overlap-offset. */
const OFFSET = "md:translate-x-10 md:translate-y-10";

export function Positioning() {
  return (
    <Section>
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16 xl:gap-20">
        {/* The padding is what the translated image occupies, so the slab
            underneath keeps the box's full height instead of being clipped. */}
        <div className="relative md:pb-10 md:pr-10">
          <div aria-hidden="true" className="absolute inset-0 hidden bg-stone md:block" />
          <div aria-hidden="true" className="h-1.5 w-full bg-bronze md:hidden" />
          <Image
            src="/home/positioning-placeholder.png"
            alt="[REPLACE] A completed Monterra terrace seen from the shared green"
            width={1200}
            height={900}
            sizes="(min-width: 768px) 45vw, 100vw"
            className={`relative w-full object-cover ${OFFSET}`}
          />
        </div>

        <p className="font-editorial text-[26px] font-light leading-[1.3] text-navy xl:text-[38px]">
          [REPLACE] We buy the site, draw the plan, pour the slab and hand over the keys. Owning
          every step is how a street ends up worth living on.
        </p>
      </Container>
    </Section>
  );
}
