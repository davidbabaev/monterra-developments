import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CompanyStory } from "@/components/about/CompanyStory";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { PullQuote } from "@/components/ui/PullQuote";
import { StatsBand } from "@/components/ui/StatsBand";

export const metadata: Metadata = buildMetadata("/about");

/**
 * Story, values, one quote, the statistics the homepage already shows, and the
 * closing band. Every part of it is a component that existed before this page.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        lede="About"
        rest="Monterra"
        subhead="[REPLACE] Who we are and how we got here."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <CompanyStory />
      <ValuesGrid />

      <Section>
        <Container>
          <PullQuote
            quote="[REPLACE] We are not in the business of selling houses. We are in the business of finishing streets that people want to live on."
            attribution="[REPLACE] Elena Marsh, Founder"
            className="max-w-[68ch]"
          />
        </Container>
      </Section>

      <StatsBand />

      <CtaBand
        lede="Come and"
        rest="see one"
        body="[REPLACE] We will walk you round a site under construction and show you what a finished one looks like."
      />
    </>
  );
}
