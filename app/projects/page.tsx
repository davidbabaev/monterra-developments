import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { ProjectsBrowser } from "@/components/project/ProjectsBrowser";
import { toCardData } from "@/components/project/projectCardData";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "[REPLACE] Completed, current and upcoming developments from Monterra Developments, across Texas, Florida and Colorado.",
};

export default function ProjectsPage() {
  const projects = getAllProjects().map(toCardData);

  return (
    <>
      <PageHero
        lede="Our"
        rest="projects"
        subhead="[REPLACE] Completed, current and upcoming developments, in the order we built them."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <Section>
        <Container className="flex flex-col gap-10">
          <p className="max-w-[68ch] font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]">
            [REPLACE] Every development we have delivered, have under construction, or have
            announced. Filter by stage to narrow the list.
          </p>

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
