import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { ContactDetails } from "@/components/forms/ContactDetails";
import { ContactForm, type ProjectOption } from "@/components/forms/ContactForm";
import { PreselectedContactForm } from "@/components/forms/PreselectedContactForm";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = buildMetadata("/contact");

/**
 * The form takes 60% of the width from 1024px and the details 40%. Below that
 * they stack with the form first: it is what the page is for, and a reader who
 * arrived from a project's call to action came intending to use it.
 */
export default function ContactPage() {
  const projects: readonly ProjectOption[] = getAllProjects().map((project) => ({
    value: project.slug,
    label: project.title,
  }));

  return (
    <>
      <PageHero
        lede="Start a"
        rest="conversation"
        subhead="[REPLACE] Tell us what you are looking for and we will come back to you."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div>
            {/*
              useSearchParams opts a route out of static prerendering unless it
              sits behind a Suspense boundary. The fallback is the same form with
              the full option list and nothing preselected — what it shows before
              hydration anyway, so there is no flash of a different layout.
            */}
            <Suspense fallback={<ContactForm projects={projects} />}>
              <PreselectedContactForm projects={projects} />
            </Suspense>
          </div>
          <ContactDetails />
        </Container>
      </Section>
    </>
  );
}
