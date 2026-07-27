import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { PAGE_SEO, SITE_URL } from "@/lib/seo";

/**
 * Every indexable route, static and generated.
 *
 * Built from PAGE_SEO rather than a second hand-kept list, so a page cannot be
 * added to the site and forgotten here. `noindex` entries are filtered out,
 * which is what keeps /styleguide from being submitted while it is still marked
 * noindex in its own metadata — one fact, one place.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.entries(PAGE_SEO)
    .filter(([, page]) => page.noindex !== true)
    .map(([path]) => ({
      url: new URL(path, SITE_URL).toString(),
      // Home first, then the rest as authored.
      priority: path === "/" ? 1 : 0.7,
    }));

  const projectRoutes = getAllProjects().map((project) => ({
    url: new URL(`/projects/${project.slug}`, SITE_URL).toString(),
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
