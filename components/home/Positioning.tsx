import { Section } from "@/components/layout/Section";
import { OffsetFeature } from "@/components/layout/OffsetFeature";

/**
 * The homepage's positioning statement, in the shared offset composition.
 *
 * The statement is the page's one editorial moment outside a heading lede.
 */

/**
 * Written against the photograph. The hoarding panels behind the group carry
 * Monterra's own name and a tagline, which is the company's site rather than
 * foreign branding, so the alt names the hoarding without quoting it. The
 * drawing on the table carries reversed lettering that is illegible at the
 * 527px this slot renders at, and the alt does not repeat it.
 */
const POSITIONING_IMAGE_ALT =
  "Three Monterra staff in white hard hats and high-visibility vests standing " +
  "at a plywood trestle table on a construction site, studying an unrolled set " +
  "of drawings, with a concrete-frame apartment building under scaffolding, a " +
  "yellow tower crane, two excavators on graded ground and blue Monterra " +
  "Developments hoarding behind them";

export function Positioning() {
  return (
    <Section>
      <OffsetFeature
        image={{
          src: "/home/positioning.webp",
          alt: POSITIONING_IMAGE_ALT,
          width: 1200,
          height: 670,
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
