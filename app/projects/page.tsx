import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Projects",
  description: "[REPLACE] Projects page description, replaced when real copy lands.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        lede="Our"
        rest="projects"
        subhead="[REPLACE] Completed, current and upcoming developments."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-[26px] font-semibold text-navy xl:text-[38px]">
            [REPLACE] Projects
          </h2>
          <p className="mt-4 max-w-[68ch] font-body text-[16px] text-ink xl:text-[17px]">
            [REPLACE] This page is a placeholder. Its content lands in a later increment.
          </p>
        </Container>
      </Section>
    </>
  );
}
