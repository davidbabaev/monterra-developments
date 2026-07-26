/** Site-wide constants. Contact details are placeholders until real ones land. */

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
  contact: {
    email: "[REPLACE] hello@monterradevelopments.com",
    phone: "[REPLACE] (512) 555-0142",
    address: {
      street: "[REPLACE] 1100 Congress Ave, Suite 400",
      city: "[REPLACE] Austin",
      state: "[REPLACE] TX",
      zip: "[REPLACE] 78701",
    },
    hours: "[REPLACE] Monday to Friday, 9am to 5pm CT",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = SiteConfig["nav"][number];
