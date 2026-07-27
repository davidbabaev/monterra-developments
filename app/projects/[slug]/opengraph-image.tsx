import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { STATUS_LABEL } from "@/lib/project-status";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

/**
 * A card per project: its status, its title and where it is.
 *
 * generateStaticParams is repeated here rather than shared with the page. Next
 * treats an image route as its own route with its own params, and a card
 * generated for a slug the loader does not know is a 404 waiting to be shared.
 */

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

type ImageProps = {
  readonly params: Promise<{ slug: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project === null) {
    throw new Error(`No project content for "${slug}" — cannot build its share card`);
  }

  return new ImageResponse(
    <OgCard
      eyebrow={STATUS_LABEL[project.status]}
      title={project.title}
      footnote={`${project.location.city}, ${project.location.state}`}
    />,
    size,
  );
}
