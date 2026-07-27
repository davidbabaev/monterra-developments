import { Section } from "@/components/layout/Section";
import { OffsetFeature } from "@/components/layout/OffsetFeature";

/**
 * The homepage's positioning statement, in the shared offset composition.
 *
 * The statement is the page's one editorial moment outside a heading lede.
 */

export function Positioning() {
  return (
    <Section>
      <OffsetFeature
        image={{
          src: "/home/positioning-placeholder.png",
          alt: "[REPLACE] A completed Monterra terrace seen from the shared green",
          width: 1200,
          height: 900,
        }}
      >
        <p className="font-editorial text-[26px] font-light leading-[1.3] text-navy xl:text-[38px]">
          [REPLACE] We buy the site, draw the plan, pour the slab and hand over the keys. Owning
          every step is how a street ends up worth living on.
        </p>
      </OffsetFeature>
    </Section>
  );
}
