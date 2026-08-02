import { Section } from "@/components/layout/Section";
import { OffsetFeature } from "@/components/layout/OffsetFeature";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The company story, in the same offset composition the homepage uses, so the
 * two pages read as the same hand.
 */

/**
 * Approved copy.
 *
 * The dates and figures here are load-bearing: 2014 and "twelve years" match the
 * statistics band, and "340 homes" is the same figure it counts. The page hero
 * says twelve years too. Changing one means changing all of them.
 */
const PARAGRAPHS: readonly string[] = [
  "Monterra began in 2014 with a single duplex on a corner lot nobody wanted. We did the drawings ourselves, hired the framer ourselves, and sold both sides before the drywall went up.",
  "Twelve years and 340 homes later, the method has not changed much. We buy sites we have walked. We design for the street before the spreadsheet. We keep the same team from permit to closing, because the person who signs off on a foundation should still be there when a buyer gets their keys.",
  "We are not the largest developer in any of our three markets, and we have turned down more sites than we have bought. That is the point.",
];

/**
 * Written against the photograph. The lit sign carries a tagline that is not
 * legible at the 456px the slot renders at, so the alt names the sign without
 * quoting it.
 */
const STORY_IMAGE_ALT =
  "Four Monterra staff in navy and cream business dress standing at a marble " +
  "counter in front of a slatted wood wall with a lit Monterra Developments " +
  "sign, scale models of apartment buildings and a blueprint on the table " +
  "beside them and a city skyline through the windows behind";

export function CompanyStory() {
  return (
    <Section>
      <OffsetFeature
        image={{
          src: "/about/story.webp",
          alt: STORY_IMAGE_ALT,
          width: 1200,
          height: 675,
        }}
      >
        <SplitHeading as="h2" lede="How" rest="we got here" />
        {PARAGRAPHS.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-5 max-w-[52ch] font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]"
          >
            {paragraph}
          </p>
        ))}
      </OffsetFeature>
    </Section>
  );
}
