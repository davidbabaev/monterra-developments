import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Allow everything and point at the sitemap.
 *
 * /styleguide is deliberately not disallowed here. A Disallow line advertises a
 * path to anyone reading robots.txt, and it stops a crawler fetching the page —
 * which also stops it seeing the noindex on the page itself. The noindex is the
 * instruction that actually keeps it out of an index.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
