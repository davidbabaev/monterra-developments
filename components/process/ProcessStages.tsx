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
  /** Written against the real photograph, not the stage title. */
  readonly imageAlt: string;
};

/**
 * Approved copy.
 *
 * Stage 04's title is one word, so its `rest` is empty and the lockup renders as
 * lede alone — see the note on SplitHeading. It is the only heading on the site
 * that does not split, because "Build" cannot be divided without adding a word
 * the copy does not have.
 *
 * The first three steps here are the same three the homepage previews, in the
 * same order and the same words: Find the site, Design for the block, Build.
 * If one changes, ProcessPreview changes with it.
 */
const STAGES: readonly Stage[] = [
  {
    numeral: "01",
    title: { lede: "Find", rest: "the site" },
    body: "We look at roughly forty sites a year and buy three. We walk each one at different hours, talk to the neighbours, and pull the zoning and drainage history before we make an offer. Most of what we learn is a reason not to proceed.",
    outcome: "Outcome: A site we understand, or a pass.",
    imageAlt:
      "Three people standing on a cleared plot marked with survey stakes, one pointing across the ground while the others hold an unrolled site plan and a tablet",
  },
  {
    numeral: "02",
    title: { lede: "Design", rest: "for the block" },
    body: "The building answers to its street first. We start with how it meets the sidewalk, where the light falls, and what it does to the house next door — then we work inward to the floor plans.",
    outcome: "Outcome: Drawings that fit the block, not just the lot.",
    imageAlt:
      "Three people around a studio table spread with floor plans and stone and tile samples, a large white model of the scheme on a table in the foreground",
  },
  {
    numeral: "03",
    title: { lede: "Entitle", rest: "and permit" },
    body: "Zoning, variances, neighbourhood review. This is the slowest stage and the one most developers rush. We budget a year and are occasionally wrong about that.",
    outcome: "Outcome: Approvals in hand, with no promises we cannot keep.",
    imageAlt:
      "Four people at a meeting-room table with rolled drawings and paperwork in front of them, a colour-coded site plan on the screen behind",
  },
  {
    numeral: "04",
    title: { lede: "Build", rest: "" },
    body: "Same superintendent from foundation to final. We self-perform framing and manage every other trade directly, because the alternative is finding out about a problem after it is covered up.",
    outcome: "Outcome: A building we would put our own name on the mailbox of.",
    imageAlt:
      "A four-storey building under construction with its frame still exposed, a tower crane lifting a steel beam and workers in high-visibility vests on the deck and at the kerb",
  },
  {
    numeral: "05",
    title: { lede: "Deliver", rest: "and stand behind it" },
    body: "Walkthrough, punch list, and a two-year structural warranty we have actually honoured. The team that built it takes the call.",
    outcome: "Outcome: Keys, and a number that still works in year three.",
    imageAlt:
      "A woman handing keys to a couple on the forecourt of a finished apartment building, with moving boxes stacked by the entrance and residents on the path behind",
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
              priority={index === 0}
              image={{
                src: `/process/stage-${stage.numeral}.webp`,
                alt: stage.imageAlt,
                width: 1920,
                height: 1072,
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
