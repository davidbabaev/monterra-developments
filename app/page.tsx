import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * Home is the one route that does not use PageHero — it gets its own tall
 * photographic hero in increment 8. This is a placeholder until then.
 */

export default function HomePage() {
  return (
    <Section>
      <Container>
        <SplitHeading as="h1" lede="Building" rest="communities" />
        <p className="mt-4 max-w-[68ch] font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]">
          [REPLACE] Home page content lands in a later increment.
        </p>
      </Container>
    </Section>
  );
}
