import { loadAllProjects } from "./project-loader";
import type { Project, ProjectStatus } from "./schema";

/**
 * Query surface over the project content. `order` controls sequence, not date —
 * sorting by completion fails because upcoming projects have none.
 */

const DEFAULT_FEATURED_LIMIT = 3;

export function getAllProjects(): Project[] {
  return [...loadAllProjects()].sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | null {
  return getAllProjects().find((project) => project.slug === slug) ?? null;
}

export function getFeaturedProjects(limit: number = DEFAULT_FEATURED_LIMIT): Project[] {
  return getAllProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return getAllProjects().filter((project) => project.status === status);
}

export type AdjacentProjects = {
  prev: Project | null;
  next: Project | null;
};

/** Neighbours by `order`, wrapping around at both ends. */
export function getAdjacentProjects(slug: string): AdjacentProjects {
  const projects = getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) return { prev: null, next: null };

  const count = projects.length;
  return {
    prev: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}
