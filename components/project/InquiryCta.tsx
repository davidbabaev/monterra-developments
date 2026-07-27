import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The one conversion on the site, in a full-bleed navy band.
 *
 * The button is the `onDark` variant: the primary button's navy fill would be
 * invisible here. The link carries the slug so the contact form can pre-select
 * this project — increment 9 reads it.
 */

type InquiryCtaProps = {
  readonly title: string;
  readonly slug: string;
};

export function InquiryCta({ title, slug }: InquiryCtaProps) {
  return (
    <Section className="bg-navy">
      <Container className="flex flex-col items-start gap-8 xl:flex-row xl:items-center xl:justify-between">
        <SplitHeading as="h2" lede="Interested" rest={`in ${title}?`} variant="dark" />
        <Button variant="onDark" href={`/contact?project=${slug}`}>
          Contact us about this project
        </Button>
      </Container>
    </Section>
  );
}
