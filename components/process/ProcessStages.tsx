import { Section } from "@/components/layout/Section";
import { OffsetFeature } from "@/components/layout/OffsetFeature";
import { SectionNumeral } from "@/components/ui/SectionNumeral";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * Five stages, alternating image-left and image-right down the page, stacking
 * with the image above the words below 768px.
 *
 * This is the only page on the site with numerals. The order is real
 * information here — a site is bought before it is drawn and drawn before it is
 * built — which is exactly the test the design reference sets for using them.
 * SectionNumeral is aria-hidden by construction, so the sequence is carried for
 * assistive technology by the ordered list rather than by the stone digits.
 */

type Stage = {
  readonly numeral: string;
  readonly title: { readonly lede: string; readonly rest: string };
  readonly body: string;
  readonly outcome: string;
};

/** [REPLACE] Placeholder copy throughout. */
const STAGES: readonly Stage[] = [
  {
    numeral: "01",
    title: { lede: "Finding", rest: "the site" },
    body: "[REPLACE] We look for land within reach of work, transit and a decent grocery, and we walk every parcel at least twice before we bid. Most of what we look at, we turn down.",
    outcome: "Outcome: a site we own outright, with no option to walk away from.",
  },
  {
    numeral: "02",
    title: { lede: "Drawing", rest: "the plan" },
    body: "[REPLACE] Our architects lay out the shared ground first — the green, the walks, the parking — and fit the homes around what it needs. Every drawing is costed before a permit is filed.",
    outcome: "Outcome: a plan that has been priced, not just approved.",
  },
  {
    numeral: "03",
    title: { lede: "Getting", rest: "it permitted" },
    body: "[REPLACE] We take the plan through zoning, drainage and the neighbourhood meetings ourselves. It is the slowest stage and the one most often underestimated, so we say what it will take.",
    outcome: "Outcome: permits in hand and a schedule we can stand behind.",
  },
  {
    numeral: "04",
    title: { lede: "Building", rest: "it" },
    body: "[REPLACE] Our own crews grade, frame and finish. The site manager who starts a phase is the one who hands it over, and the same crew comes back if something needs putting right.",
    outcome: "Outcome: a home built by people you can put a name to.",
  },
  {
    numeral: "05",
    title: { lede: "Handing", rest: "over" },
    body: "[REPLACE] We walk each home with its buyer, list what is outstanding and fix it before closing. The warranty is ours, not a subcontractor's, for two years after you move in.",
    outcome: "Outcome: keys, a snag list already closed, and a number that answers.",
  },
];

export function ProcessStages() {
  return (
    <Section>
      {/* Labelled, like ProjectGrid's list: it is one of two ordered lists on
          the page and the other one is the breadcrumb. */}
      <ol aria-label="Our process" className="flex flex-col gap-16 xl:gap-24">
        {STAGES.map((stage, index) => (
          <li key={stage.numeral}>
            <OffsetFeature
              reverse={index % 2 === 1}
              image={{
                src: `/process/stage-${stage.numeral}-placeholder.png`,
                alt: `[REPLACE] ${stage.title.lede} ${stage.title.rest}, on a Monterra site`,
                width: 1200,
                height: 900,
              }}
            >
              <SectionNumeral value={stage.numeral} />
              <SplitHeading
                as="h2"
                lede={stage.title.lede}
                rest={stage.title.rest}
                className="mt-2"
              />
              <p className="mt-4 max-w-[52ch] font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]">
                {stage.body}
              </p>
              <p className="mt-4 max-w-[52ch] font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
                {stage.outcome}
              </p>
            </OffsetFeature>
          </li>
        ))}
      </ol>
    </Section>
  );
}
