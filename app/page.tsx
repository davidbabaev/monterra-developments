import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { Positioning } from "@/components/home/Positioning";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { CtaBand } from "@/components/layout/CtaBand";
import { StatsBand } from "@/components/ui/StatsBand";
import { toCardData } from "@/components/project/projectCardData";
import { getFeaturedProjects } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata("/");

/**
 * Six sections, in this order, and no seventh. The reference this site is drawn
 * from runs to nine and the message thins out; the cut is the point.
 *
 * Home is the one route with no PageHero — it gets the tall photographic hero
 * instead.
 */

export default function HomePage() {
  const featured = getFeaturedProjects().map(toCardData);

  return (
    <>
      <Hero />
      <Positioning />
      <FeaturedProjects projects={featured} />
      <StatsBand />
      <ProcessPreview />
      <CtaBand
        lede="Let's"
        rest="talk about what you're planning"
        // [REPLACE] No approved copy for this line yet — the heading above it is
        // approved, the body is not.
        body="[REPLACE] Whether you are buying, investing or bringing us a site, we reply within two business days."
      />
    </>
  );
}
