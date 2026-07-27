import { Section } from "@/components/layout/Section";
import { OffsetFeature } from "@/components/layout/OffsetFeature";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The company story, in the same offset composition the homepage uses, so the
 * two pages read as the same hand.
 */

/** [REPLACE] Placeholder copy throughout. */
const PARAGRAPHS: readonly string[] = [
  "[REPLACE] Monterra started in 2008 with one duplex in East Austin and a crew of four. We had no investors and no land bank, so we learned to buy carefully and build only what we could finish.",
  "[REPLACE] Eighteen years later the crews are larger and the sites are bigger, but the order is the same: buy the land, draw the plan, build it ourselves, hand over the keys.",
];

export function CompanyStory() {
  return (
    <Section>
      <OffsetFeature
        image={{
          src: "/about/story-placeholder.png",
          alt: "[REPLACE] The Monterra site team walking a street under construction",
          width: 1200,
          height: 900,
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
