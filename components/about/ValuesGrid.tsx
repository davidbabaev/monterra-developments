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

/** [REPLACE] Placeholder copy throughout. */
const VALUES: readonly Value[] = [
  {
    eyebrow: "Ownership",
    title: "We carry the risk",
    description:
      "[REPLACE] We buy our sites outright rather than optioning them, so a project that gets hard is our problem to solve rather than someone else's to walk away from.",
  },
  {
    eyebrow: "Craft",
    title: "Our own crews build it",
    description:
      "[REPLACE] The people who frame a house are the people who answer for it afterwards. Nothing is subcontracted out to the lowest number on a page.",
  },
  {
    eyebrow: "Place",
    title: "We design for the street",
    description:
      "[REPLACE] A home is only as good as the walk to it. We plan the shared ground first and fit the buildings around what it needs.",
  },
  {
    eyebrow: "Plain dealing",
    title: "We quote what it costs",
    description:
      "[REPLACE] Prices, dates and specifications are written down before a contract is signed, and we tell you early when something moves.",
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
