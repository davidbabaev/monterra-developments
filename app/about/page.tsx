import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CompanyStory } from "@/components/about/CompanyStory";
import { TeamPhoto } from "@/components/about/TeamPhoto";
import { ValuesGrid } from "@/components/about/ValuesGrid";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { PullQuote } from "@/components/ui/PullQuote";
import { StatsBand } from "@/components/ui/StatsBand";

export const metadata: Metadata = buildMetadata("/about");

/**
 * Story, values, one quote, the group photograph, the statistics the homepage
 * already shows, and the closing band. Everything but the photograph is a
 * component that existed before this page.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        lede="Twelve"
        rest="years of building"
        subhead="We started with one duplex in East Austin and never changed how we work."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <CompanyStory />
      <ValuesGrid />

      <Section>
        <Container>
          {/*
            The attribution has to stay in step with content/team.json, where the
            same person is listed as "Elena Marsh, Founder and Principal" — the
            role has to be spelled the same way in both places. A quote attributed
            to someone the team page does not list reads as invented, which on a
            concept project is the one impression worth avoiding.
          */}
          <PullQuote
            quote="The question is never whether we can build it. It is whether the street will be better with it than without it."
            attribution="Elena Marsh, Founder and Principal"
            className="max-w-[68ch]"
          />
        </Container>
      </Section>

      <TeamPhoto />

      <StatsBand />

      <CtaBand
        lede="Come and"
        rest="see one"
        body="We are always looking at sites in our three markets, and always happy to look at one more."
      />
    </>
  );
}
