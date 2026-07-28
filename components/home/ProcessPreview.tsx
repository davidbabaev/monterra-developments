import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SectionNumeral } from "@/components/ui/SectionNumeral";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The only numbered section on this page. Numerals earn their place here because
 * the steps are a real sequence — numbering "Selected work" as 03 would tell a
 * reader nothing.
 *
 * SectionNumeral is aria-hidden by construction, so the order is carried for
 * assistive technology by the ordered list, not by the stone digits.
 */

type Step = {
  readonly numeral: string;
  readonly title: string;
  readonly description: string;
};

/** Approved copy. The full five stages live on /process. */
const STEPS: readonly Step[] = [
  {
    numeral: "01",
    title: "Find the site",
    description: "We walk every block before we buy. Most sites we look at, we pass on.",
  },
  {
    numeral: "02",
    title: "Design for the block",
    description: "The building answers to its street first, and to the pro forma second.",
  },
  {
    numeral: "03",
    title: "Build and deliver",
    description:
      "Same team from permit to closing. No handoff to a subcontractor we have never worked with.",
  },
];

export function ProcessPreview() {
  return (
    <Section>
      <Container>
        <SplitHeading as="h2" lede="How" rest="we work" />

        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8 xl:gap-12">
          {STEPS.map((step) => (
            <li key={step.numeral}>
              <SectionNumeral value={step.numeral} />
              <h3 className="mt-2 font-display text-[19px] font-semibold text-navy xl:text-[22px]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[42ch] font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-10">
          <Button variant="text" href="/process">
            How we build
          </Button>
        </p>
      </Container>
    </Section>
  );
}
