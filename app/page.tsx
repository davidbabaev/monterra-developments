import { ClosingCta } from "@/components/home/ClosingCta";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { Positioning } from "@/components/home/Positioning";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { StatsBand } from "@/components/home/StatsBand";
import { toCardData } from "@/components/project/projectCardData";
import { getFeaturedProjects } from "@/lib/projects";

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
      <ClosingCta />
    </>
  );
}
