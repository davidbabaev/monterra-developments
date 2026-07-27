import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AmenityList } from "@/components/project/AmenityList";
import { FloorPlanList } from "@/components/project/FloorPlanList";
import { Gallery } from "@/components/project/Gallery";
import { InquiryCta } from "@/components/project/InquiryCta";
import { LocationBlock } from "@/components/project/LocationBlock";
import { ProjectBody } from "@/components/project/ProjectBody";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectNav, type ProjectNavItem } from "@/components/project/ProjectNav";
import { SpecTable } from "@/components/project/SpecTable";
import { StatusTracker } from "@/components/project/StatusTracker";
import { toCardData } from "@/components/project/projectCardData";
import type { Project } from "@/lib/project-loader";
import { getAdjacentProjects, getAllProjects, getProjectBySlug } from "@/lib/projects";

/**
 * Section order is fixed. Every section below the overview is optional except the
 * location and the status tracker, which run off data every project has.
 *
 * An absent section renders nothing at all — no heading, no "TBA", no blank spec
 * row. The sections are flex children, so a section that returns null takes its
 * gap with it and a sparse project reads as intentionally short rather than
 * broken.
 */

type PageProps = {
  readonly params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project === null) return {};

  const { seo, title, summary } = project;

  return {
    // `absolute` when authored: the override already carries the site name and
    // the root template would append it a second time.
    title: seo?.title === undefined ? title : { absolute: seo.title },
    description: seo?.description ?? summary,
  };
}

const toNavItem = (project: Project): ProjectNavItem => {
  const { slug, title, hero } = toCardData(project);
  return { slug, title, hero };
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project === null) notFound();

  const { title, status, location, specs, amenities, media, body } = project;
  const { prev, next } = getAdjacentProjects(slug);

  return (
    <>
      <ProjectHero
        title={title}
        status={status}
        city={location.city}
        state={location.state}
        image={media.hero}
      />

      <Section>
        <Container className="flex flex-col gap-16 xl:gap-24">
          {/*
            The spec table is first in the DOM so it sits above the prose on a
            phone, then takes the second column from 1024px through explicit grid
            placement rather than an order utility. Both items are in row 1, so
            the column stretches to the prose's height and the panel inside it has
            room to stick.
          */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div className="lg:col-start-2 lg:row-start-1">
              <div className="lg:sticky lg:top-24">
                <SpecTable specs={specs} status={status} />
              </div>
            </div>
            <div className="max-w-[68ch] lg:col-start-1 lg:row-start-1">
              <ProjectBody source={body} />
            </div>
          </div>

          <LocationBlock title={title} location={location} />
          <AmenityList amenities={amenities} />
          <Gallery images={media.gallery} />
          <FloorPlanList plans={media.floorPlans} />
          <StatusTracker status={status} title={title} />
        </Container>
      </Section>

      <InquiryCta title={title} slug={slug} />

      <Section>
        <Container>
          <ProjectNav
            currentSlug={slug}
            prev={prev === null ? null : toNavItem(prev)}
            next={next === null ? null : toNavItem(next)}
          />
        </Container>
      </Section>
    </>
  );
}
