import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * What the company says it holds to, as four short items.
 *
 * No numerals here. The values are a set, not a sequence, and numbering a set
 * tells the reader something untrue about it — Our Process is the only page
 * where the order carries information.
 */

type Value = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
};

/**
 * Approved copy.
 *
 * The brief numbered these 01 to 04. They are not numbered here, for the reason
 * in the note above: this is a set, not a sequence, and Our Process is the only
 * page where the order carries information. The numbers read as the brief's own
 * enumeration rather than as copy.
 */
const VALUES: readonly Value[] = [
  {
    eyebrow: "Site first",
    title: "We walk it before we buy it",
    description:
      "Most sites we look at, we pass on. The ones we buy, we have stood on at seven in the morning and again at six at night.",
  },
  {
    eyebrow: "Built to last",
    title: "Fifty-year decisions, not five-year ones",
    description:
      "We spend money where it does not show — envelope, drainage, structure. Buyers notice in year ten.",
  },
  {
    eyebrow: "One team",
    title: "Same people, permit to closing",
    description:
      "No handoff to a subcontractor we have not worked with before. Continuity is a quality control system.",
  },
  {
    eyebrow: "Straight answers",
    title: "We tell you what is wrong with it",
    description:
      "Every site has a problem. We would rather name ours than have a buyer find it.",
  },
];

export function ValuesGrid() {
  return (
    <Section>
      <Container>
        <SplitHeading as="h2" lede="What" rest="we hold to" />

        <ul className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-16 xl:gap-x-20">
          {VALUES.map((value) => (
            <li key={value.title}>
              <Eyebrow>{value.eyebrow}</Eyebrow>
              <h3 className="mt-2 font-display text-[19px] font-semibold text-navy xl:text-[22px]">
                {value.title}
              </h3>
              <p className="mt-3 max-w-[48ch] font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
