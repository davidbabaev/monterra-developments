import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { TeamGrid } from "@/components/team/TeamGrid";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = buildMetadata("/team");

export default function TeamPage() {
  const members = getTeam();

  return (
    <>
      <PageHero
        lede="The"
        rest="team"
        subhead="[REPLACE] The people who buy the land, draw the plans and build the homes."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Team" }]}
      />

      <Section>
        <Container>
          {/* Each member's name is an h3, so the outline needs this level to
              step through. Hidden because the page title already says it. */}
          <h2 className="sr-only">Our people</h2>
          <TeamGrid members={members} />
        </Container>
      </Section>

      <CtaBand
        lede="Work"
        rest="with us"
        body="[REPLACE] We hire site managers and carpenters directly. Tell us what you have built."
      />
    </>
  );
}
