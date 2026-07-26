import type { Project } from "@/lib/project-loader";
import type { ProjectStatus } from "@/lib/schema";

/**
 * The subset of a project a card needs.
 *
 * The listing filters on the client, so this crosses the server/client boundary
 * on every page load. Sending whole projects would ship every MDX body with it.
 */
export type ProjectCardData = {
  readonly slug: string;
  readonly title: string;
  readonly status: ProjectStatus;
  readonly city: string;
  readonly state: string;
  readonly propertyTypes: readonly string[];
  readonly units?: number;
  readonly completion?: string;
  readonly hero: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
};

export function toCardData(project: Project): ProjectCardData {
  const { slug, title, status, location, specs, media } = project;
  return {
    slug,
    title,
    status,
    city: location.city,
    state: location.state,
    propertyTypes: specs.propertyTypes,
    ...(specs.units === undefined ? {} : { units: specs.units }),
    ...(specs.completion === undefined ? {} : { completion: specs.completion }),
    hero: {
      src: media.hero.src,
      alt: media.hero.alt,
      width: media.hero.width,
      height: media.hero.height,
    },
  };
}
