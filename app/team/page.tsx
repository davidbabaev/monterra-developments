import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Team",
  description: "[REPLACE] Team page description, replaced when real copy lands.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        lede="The"
        rest="team"
        subhead="[REPLACE] The people who plan, build and sell our developments."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Team" }]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-[26px] font-semibold text-navy xl:text-[38px]">
            [REPLACE] Team
          </h2>
          <p className="mt-4 max-w-[68ch] font-body text-[16px] text-ink xl:text-[17px]">
            [REPLACE] This page is a placeholder. Its content lands in a later increment.
          </p>
        </Container>
      </Section>
    </>
  );
}
