import type { Metadata } from "next";
import { siteConfig } from "./site";

/**
 * Every page's title and description in one table, and the helper that turns an
 * entry into Next metadata.
 *
 * One table rather than a string typed into each page, for two reasons. Search
 * engines penalise duplicate titles and descriptions, and duplicates are
 * invisible when the copy is spread across nine files. And a description has a
 * real budget — roughly 150 to 160 characters before Google truncates it — which
 * is only enforceable if every one of them can be measured together.
 * tests/unit/seo.test.ts asserts both.
 *
 * [REPLACE] Every description below is placeholder copy about a placeholder
 * company. The marker is here rather than inside the strings: a visible
 * "[REPLACE]" would be published into search results, and it would eat 10 of the
 * 160 characters that are the point of the exercise.
 */

/**
 * The deployment origin. Everything canonical, every OG image URL, the sitemap
 * and the robots.txt sitemap pointer resolve against it, so a wrong value here
 * mislabels the whole site.
 *
 * This is the domain the site actually deploys to. If Monterra ever takes its
 * own domain, this is the one line that changes.
 */
export const SITE_URL = "https://monterra.davidbabaev.dev";

export type PageSeo = {
  /** Rendered through the "%s | Monterra Developments" template. */
  readonly title: string;
  /** 150–160 characters. */
  readonly description: string;
  /** Home sets its own full title rather than being suffixed with the site name. */
  readonly absoluteTitle?: boolean;
  readonly noindex?: boolean;
};

const PAGES = {
  "/": {
    title: `${siteConfig.name} — homes built by the people who designed them`,
    description:
      "Monterra Developments buys the land, draws the plan and builds townhomes, condominiums and duplexes with its own crews across Texas, Florida and Colorado.",
    absoluteTitle: true,
  },
  "/projects": {
    title: "Projects",
    description:
      "Every Monterra development, whether completed, under construction or announced, with the property types, unit counts and delivery dates we have committed to.",
  },
  "/about": {
    title: "About",
    description:
      "Monterra has bought, designed and built homes since 2014, with its own crews and no outside investors. How the company works, and what it holds itself to.",
  },
  "/process": {
    title: "Our Process",
    description:
      "The five stages of a Monterra development: finding the site, drawing and costing the plan, getting it permitted, building it, and handing over the keys.",
  },
  "/team": {
    title: "Team",
    description:
      "The people who buy the land, draw the plans, carry them through permitting and build the homes at Monterra Developments, and what each of them answers for.",
  },
  "/contact": {
    title: "Contact",
    description:
      "Tell Monterra Developments what you are looking for — a home, an investment, or a site you would like us to look at — and we reply within two business days.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "What Monterra Developments does with the details you send through this website, how long they are kept, and how to ask for a copy of them or have them deleted.",
  },
  "/styleguide": {
    title: "Styleguide",
    description:
      "Internal reference: every design token, type size and interface primitive in the Monterra system, with the measured contrast ratio of each colour pair we use.",
    noindex: true,
  },
} as const satisfies Record<string, PageSeo>;

/** The literal keys, so a caller cannot ask for a path that has no entry. */
export type SeoPath = keyof typeof PAGES;

/**
 * The same table, widened to PageSeo. Without this the optional fields are
 * absent from the type of any entry that omits them, and a consumer reading
 * `noindex` across all of them — the sitemap — will not compile.
 */
export const PAGE_SEO: Record<SeoPath, PageSeo> = PAGES;

/**
 * The default share card, named explicitly.
 *
 * A file-based opengraph-image is inherited by nested routes only while they do
 * not declare an `openGraph` object of their own — declaring one replaces the
 * inherited images along with everything else. Every page here declares one, so
 * without this line six of them shipped with no og:image at all. Project pages
 * have their own card file, which does win for its own segment.
 */
const DEFAULT_OG_IMAGE = "/opengraph-image";

/**
 * The shared shape: canonical URL, Open Graph and the Twitter card.
 */
export function buildMetadata(path: SeoPath): Metadata {
  const page = PAGE_SEO[path];

  return {
    title: page.absoluteTitle === true ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      url: path,
      title: page.absoluteTitle === true ? page.title : `${page.title} | ${siteConfig.name}`,
      description: page.description,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image" },
    ...(page.noindex === true ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * A project page's description: the authored override when there is one, or a
 * sentence built from the content.
 *
 * The fallback exists so a project added without SEO copy still ships something
 * true and readable. It will not always land in the 150–160 window that authored
 * copy can hit, which is why every seeded project has an authored description and
 * tests/unit/seo.test.ts holds them to the range.
 */
export function projectDescription(project: {
  readonly summary: string;
  readonly seo?: { readonly description?: string };
  readonly location: { readonly city: string; readonly state: string };
}): string {
  const { seo, summary, location } = project;
  return seo?.description ?? `${summary} In ${location.city}, ${location.state}.`;
}
