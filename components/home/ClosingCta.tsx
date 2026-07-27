import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The page's last word: a navy band carrying the single conversion.
 *
 * Same shape as InquiryCta on a project page, and the same reason for the
 * `onDark` button — a navy fill on a navy band is not a button.
 */

export function ClosingCta() {
  return (
    <Section className="bg-navy">
      <Container className="flex flex-col items-start gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <SplitHeading as="h2" lede="Tell us" rest="what you are looking for" variant="dark" />
          <p className="mt-4 max-w-[52ch] font-body text-[16px] text-ivory/88 xl:text-[17px]">
            [REPLACE] Whether you are buying, investing or bringing us a site, we reply within two
            business days.
          </p>
        </div>
        <Button variant="onDark" href="/contact">
          Contact us
        </Button>
      </Container>
    </Section>
  );
}
