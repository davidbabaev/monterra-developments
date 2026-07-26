import { ProjectCard } from "./ProjectCard";
import type { ProjectCardData } from "./projectCardData";

/** 1 column below 768px, 2 to 1279px, 3 from 1280px. */

type ProjectGridProps = {
  readonly projects: readonly ProjectCardData[];
};

/** The first row is above the fold at every breakpoint. */
const PRIORITY_COUNT = 3;

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <ul
      aria-label="Projects"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
    >
      {projects.map((project, index) => (
        <li key={project.slug}>
          <ProjectCard project={project} priority={index < PRIORITY_COUNT} />
        </li>
      ))}
    </ul>
  );
}
