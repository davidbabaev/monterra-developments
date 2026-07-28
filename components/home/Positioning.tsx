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
          We build in places we would live ourselves. That constraint has cost us deals, and it is
          why our buildings still look right ten years on.
        </p>
      </OffsetFeature>
    </Section>
  );
}
