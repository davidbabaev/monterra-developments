import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CardMedia } from "@/components/ui/CardMedia";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ProjectCardData } from "./projectCardData";

/**
 * The whole card is one link — the "View project" text is styled, not a nested
 * anchor, so a screen reader hears one target rather than two.
 *
 * An `upcoming` project has no units and no completion date. Rather than
 * rendering blanks, its metadata line is a different line: property types and
 * the location. Segments are assembled as a list and joined, so a missing
 * field can never leave a stray separator behind.
 */

type ProjectCardProps = {
  readonly project: ProjectCardData;
  /** Cards above the fold on the listing get priority. */
  readonly priority?: boolean;
};

const CTA_LABEL = {
  completed: "View project",
  current: "View project",
  upcoming: "Register interest",
} as const;

function metadataFor(project: ProjectCardData): string {
  const propertyTypes = project.propertyTypes.join(" · ");

  if (project.status === "upcoming") {
    return [propertyTypes, `${project.city}, ${project.state}`].join(" · ");
  }

  return [
    propertyTypes,
    project.units === undefined ? null : `${project.units} units`,
    project.completion ?? null,
  ]
    .filter((segment): segment is string => segment !== null && segment !== "")
    .join(" · ");
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block h-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
    >
      <Card className="flex h-full flex-col overflow-hidden">
        {/* The badge sits outside CardMedia so the hover scale does not move it. */}
        <div className="relative">
          <CardMedia>
            <Image
              src={project.hero.src}
              alt={project.hero.alt}
              width={project.hero.width}
              height={project.hero.height}
              priority={priority}
              sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
              className="aspect-[3/2] w-full object-cover"
            />
          </CardMedia>
          <StatusBadge status={project.status} className="absolute left-4 top-4" />
        </div>

        {/* flex-1 + mt-auto keeps the call to action on the baseline across a
            row, so a shorter metadata line does not leave a ragged grid. */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-[19px] font-semibold text-navy xl:text-[22px]">
            {project.title}
          </h3>
          <p className="mt-1 font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate">
            {project.city}, {project.state}
          </p>
          <p className="mt-3 font-body text-[15px] text-ink">{metadataFor(project)}</p>
          <p className="mt-auto pt-4 font-display text-[15px] font-semibold text-navy">
            {CTA_LABEL[project.status]}
            <span
              aria-hidden="true"
              className="ml-2 text-[12px] text-bronze motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-1 inline-block"
            >
              →
            </span>
          </p>
        </div>
      </Card>
    </Link>
  );
}
