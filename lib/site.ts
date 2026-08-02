/**
 * Site-wide constants.
 *
 * The contact block was placeholder copy marked `[REPLACE]` until 2026-08-02.
 * It now carries the approved details and no markers, so `label` and `href` are
 * two views of the same value rather than a staged one and a working one, and
 * the Organization schema publishes the address instead of dropping it.
 *
 * The details are invented, like everything else on this concept project. The
 * footer already says so on every page, which is where a caveat belongs — not
 * repeated into each field, where it would ship as visible copy.
 *
 * No `socials` key. Two links to accounts that do not exist were removed rather
 * than pointed at `#`: they render under a "Follow" heading with
 * `target="_blank"`, so a `#` href opens a duplicate tab of the current page,
 * and an unmarked `#` would have been published in the schema's `sameAs`.
 */

export const siteConfig = {
  name: "Monterra Developments",
  tagline: "Building Communities. Creating Value.",
  description:
    "Monterra Developments builds and sells townhomes, condominiums and duplexes across the United States.",

  nav: [
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Our Process", href: "/process" },
    { label: "Team", href: "/team" },
  ],

  /** The header and mobile nav CTA. */
  cta: { label: "Contact us", href: "/contact" },

  footerNav: {
    company: [
      { label: "About", href: "/about" },
      { label: "Our Process", href: "/process" },
      { label: "Team", href: "/team" },
    ],
  },

  contact: {
    email: {
      label: "hello@monterradevelopments.com",
      href: "mailto:hello@monterradevelopments.com",
    },
    phone: {
      label: "(512) 555-0142",
      href: "tel:+15125550142",
    },
    address: {
      street: "1100 Congress Avenue, Suite 400",
      locality: "Austin, TX 78701",
    },
    hours: "Monday to Friday, 9am to 5pm CT",
  },

  legal: { label: "Privacy Policy", href: "/privacy" },
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = SiteConfig["nav"][number];
