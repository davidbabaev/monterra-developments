import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { ProjectsBrowser } from "@/components/project/ProjectsBrowser";
import { toCardData } from "@/components/project/projectCardData";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = buildMetadata("/projects");

export default function ProjectsPage() {
  const projects = getAllProjects().map(toCardData);

  return (
    <>
      <PageHero
        lede="Our"
        rest="projects"
        subhead="Nine completed, one under construction, one on the way."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <Section>
        <Container className="flex flex-col gap-10">
          <p className="max-w-[68ch] font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]">
            We build in Austin, Tampa and Denver. These are the ones worth showing.
          </p>

          {/*
            The cards are h3s, so without this the outline jumps from the page
            title straight to a project name. Visually hidden because the design
            has no heading here — the filter and the grid speak for themselves —
            but a screen reader gets a level to navigate by rather than a gap.
          */}
          <h2 className="sr-only">All developments</h2>

          {/*
            useSearchParams opts a route out of static prerendering unless it
            sits behind a Suspense boundary. The fallback is the full,
            unfiltered grid — the same thing the page shows before hydration,
            so there is no flash of a different layout.
          */}
          <Suspense fallback={<ProjectGrid projects={projects} />}>
            <ProjectsBrowser projects={projects} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
