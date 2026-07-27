import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { TeamGrid } from "@/components/team/TeamGrid";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "[REPLACE] The people who buy the land, draw the plans and build the homes at Monterra Developments.",
};

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
