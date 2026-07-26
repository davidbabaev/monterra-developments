import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

/**
 * Placeholder detail route. The real page is increment 6 — this exists so the
 * shell has a reachable dynamic route and the breadcrumb pattern is proven.
 *
 * The loader is used only for the slug list and for rejecting unknown slugs;
 * no project content is rendered yet.
 */

type PageProps = {
  readonly params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `[REPLACE] ${slug}` };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (getProjectBySlug(slug) === null) notFound();

  return (
    <>
      <PageHero
        lede="Project"
        rest="detail"
        subhead="[REPLACE] The project detail page is built in a later increment."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: slug },
        ]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-[26px] font-semibold text-navy xl:text-[38px]">
            [REPLACE] {slug}
          </h2>
          <p className="mt-4 max-w-[68ch] font-body text-[16px] text-ink xl:text-[17px]">
            [REPLACE] This page is a placeholder. Project content lands in increment 6.
          </p>
        </Container>
      </Section>
    </>
  );
}
