import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Contact",
  description: "[REPLACE] Contact page description, replaced when real copy lands.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        lede="Start a"
        rest="conversation"
        subhead="[REPLACE] Tell us what you are looking for and we will come back to you."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-[26px] font-semibold text-navy xl:text-[38px]">
            [REPLACE] Contact
          </h2>
          <p className="mt-4 max-w-[68ch] font-body text-[16px] text-ink xl:text-[17px]">
            [REPLACE] This page is a placeholder. Its content lands in a later increment.
          </p>
        </Container>
      </Section>
    </>
  );
}
