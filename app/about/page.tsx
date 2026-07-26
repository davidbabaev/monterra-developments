import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "About",
  description: "[REPLACE] About page description, replaced when real copy lands.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        lede="About"
        rest="Monterra"
        subhead="[REPLACE] Who we are and how we got here."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-[26px] font-semibold text-navy xl:text-[38px]">
            [REPLACE] About
          </h2>
          <p className="mt-4 max-w-[68ch] font-body text-[16px] text-ink xl:text-[17px]">
            [REPLACE] This page is a placeholder. Its content lands in a later increment.
          </p>
        </Container>
      </Section>
    </>
  );
}
