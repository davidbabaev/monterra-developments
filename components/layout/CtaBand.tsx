import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Container } from "./Container";
import { Section } from "./Section";

/**
 * The navy band that closes a page, carrying the site's single conversion.
 *
 * The copy is a prop rather than baked in: the homepage, About and Our Process
 * all end on this band and none of them should say the same sentence. The
 * `onDark` button is not a choice — a navy fill on a navy band is not a button.
 */

type CtaBandProps = {
  readonly lede: string;
  readonly rest: string;
  readonly body?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
};

export function CtaBand({
  lede,
  rest,
  body,
  ctaLabel = "Contact us",
  ctaHref = "/contact",
}: CtaBandProps) {
  return (
    <Section surface="navy">
      <Container className="flex flex-col items-start gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <SplitHeading as="h2" lede={lede} rest={rest} variant="dark" />
          {body !== undefined && (
            <p className="mt-4 max-w-[52ch] font-body text-[16px] text-ivory/88 xl:text-[17px]">
              {body}
            </p>
          )}
        </div>
        <Button variant="onDark" href={ctaHref}>
          {ctaLabel}
        </Button>
      </Container>
    </Section>
  );
}
