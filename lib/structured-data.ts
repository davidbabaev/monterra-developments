import { realOrUndefined } from "./placeholder";
import type { Project } from "./project-loader";
import { SITE_URL } from "./seo";
import { siteConfig } from "./site";

/**
 * schema.org objects, built from the same data the pages render.
 *
 * Nothing is invented here. A field is emitted when the content has it and
 * omitted when it does not — a `Residence` with no coordinates is not a
 * Residence, and a half-populated block is worse than none: it tells a crawler
 * something untrue and can earn a structured-data warning that outlives the fix.
 *
 * The same rule applies to placeholder copy. A value still carrying `[REPLACE]`
 * is dropped rather than published: structured data is read by machines that
 * never see the marker for what it is.
 */

export function organizationSchema(): Record<string, unknown> {
  const { contact } = siteConfig;

  const street = realOrUndefined(contact.address.street);
  const locality = realOrUndefined(contact.address.locality);
  const sameAs = siteConfig.socials
    .map((social) => realOrUndefined(social.href))
    .filter((href): href is string => href !== undefined);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: SITE_URL,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    // The hrefs are unmarked so the links work; the values behind them are still
    // placeholders, tracked in docs/content-checklist.md.
    email: contact.email.href.replace("mailto:", ""),
    telephone: contact.phone.href.replace("tel:", ""),
    // Omitted entirely while the address is a placeholder — a PostalAddress with
    // only a country is not an address.
    ...(street === undefined || locality === undefined
      ? {}
      : {
          address: {
            "@type": "PostalAddress",
            streetAddress: street,
            addressLocality: locality,
            addressCountry: "US",
          },
        }),
    ...(sameAs.length === 0 ? {} : { sameAs }),
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

  // A street still carrying the marker is dropped, exactly as an absent one is.
  // The rest of the address is real — city and state are required by the schema.
  const street = realOrUndefined(project.location.address);

  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/projects/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      ...(street === undefined ? {} : { streetAddress: street }),
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
