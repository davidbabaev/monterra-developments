/**
 * Site-wide constants.
 *
 * Every contact value is a placeholder. The visible `label` carries `[REPLACE]`
 * so it is obvious in the browser and greppable in the source; `href` stays
 * clean so `tel:` and `mailto:` links actually work in the meantime.
 */

export const siteConfig = {
  name: "Monterra Developments",
  tagline: "Building Communities. Creating Value.",
  description:
    "[REPLACE] Monterra Developments builds and sells townhomes, condominiums and duplexes across the United States.",

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
      label: "[REPLACE] hello@monterradevelopments.com",
      href: "mailto:hello@monterradevelopments.com",
    },
    phone: {
      label: "[REPLACE] (512) 555-0142",
      href: "tel:+15125550142",
    },
    address: {
      street: "[REPLACE] 1100 Congress Ave, Suite 400",
      locality: "[REPLACE] Austin, TX 78701",
    },
    hours: "[REPLACE] Monday to Friday, 9am to 5pm CT",
  },

  socials: [
    { label: "LinkedIn", href: "[REPLACE] https://www.linkedin.com/company/monterra-developments" },
    { label: "Instagram", href: "[REPLACE] https://www.instagram.com/monterradevelopments" },
  ],

  legal: { label: "Privacy Policy", href: "/privacy" },
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = SiteConfig["nav"][number];
