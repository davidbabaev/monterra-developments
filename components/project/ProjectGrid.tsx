import { ProjectCard } from "./ProjectCard";
import type { ProjectCardData } from "./projectCardData";

/** 1 column below 768px, 2 to 1279px, 3 from 1280px. */

type ProjectGridProps = {
  readonly projects: readonly ProjectCardData[];
};

/**
 * Only the first card gets `priority`.
 *
 * The whole first row used to, on the reasoning that a row is above the fold at
 * every breakpoint. That was true of the layout and wrong about the network:
 * three preloads race each other, and the one that is actually the LCP element
 * finishes later for it. At 390px only the first card is above the fold anyway —
 * the second starts at y=1179 — so the other two were preloading images nobody
 * had scrolled to yet.
 *
 * Measured against real photography: /projects sat at 89 with three, and the
 * LCP element is the first card's image.
 *
 * This follows grid position, not a slug, so reordering or filtering the list
 * moves the flag with it and whichever card lands first is the one that gets it.
 */
const isFirstInGrid = (index: number) => index === 0;

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <ul
      aria-label="Projects"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
    >
      {projects.map((project, index) => (
        <li key={project.slug}>
          <ProjectCard project={project} priority={isFirstInGrid(index)} />
        </li>
      ))}
    </ul>
  );
}
