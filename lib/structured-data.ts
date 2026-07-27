import type { Project } from "./project-loader";
import { SITE_URL } from "./seo";
import { siteConfig } from "./site";

/**
 * schema.org objects, built from the same data the pages render.
 *
 * Nothing is invented here. A field is emitted when the content has it and
 * omitted when it does not — a `Place` with no coordinates is not a Place, and a
 * half-populated block is worse than none: it tells a crawler something untrue
 * and can earn a structured-data warning that outlives the fix.
 */

export function organizationSchema(): Record<string, unknown> {
  const { contact } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: SITE_URL,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    // [REPLACE] Placeholder contact details, as everywhere else.
    email: contact.email.href.replace("mailto:", ""),
    telephone: contact.phone.href.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.locality,
      addressCountry: "US",
    },
    sameAs: siteConfig.socials.map((social) => social.href),
  };
}

/**
 * A `Residence` for a development, with a `geo` block only when the project
 * carries coordinates. Monterra Bay has none, so it emits nothing at all rather
 * than a Residence with an empty location.
 */
export function projectSchema(project: Project): Record<string, unknown> | null {
  const { coords } = project.location;
  if (coords === undefined) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/projects/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      ...(project.location.address === undefined
        ? {}
        : { streetAddress: project.location.address }),
      addressLocality: project.location.city,
      addressRegion: project.location.state,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: coords.lat,
      longitude: coords.lng,
    },
  };
}
