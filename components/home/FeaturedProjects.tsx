import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { ProjectCardData } from "@/components/project/projectCardData";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * The featured projects, in ProjectCard exactly as the listing renders them.
 *
 * One list, two layouts: a snap-scrolling row below 768px with the cards at 82vw
 * so the next one peeks and the reader knows to swipe, and an ordinary grid
 * above it. The switch is `flex` to `grid`, so no card is duplicated in the DOM
 * and there is one tab stop per project at every width.
 *
 * The scroller only ever overflows horizontally, so a vertical drag or wheel
 * passes straight through to the page.
 */

type FeaturedProjectsProps = {
  readonly projects: readonly ProjectCardData[];
};

/**
 * Two featured projects fill a two-column grid; a third would leave a hole in it,
 * so the column count follows the data rather than a fixed three.
 */
const columnsFor = (count: number) =>
  count >= 3 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2";

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <Section>
      <Container>
        <Eyebrow>Selected work</Eyebrow>
        <SplitHeading as="h2" lede="Recent" rest="developments" className="mt-3" />

        {/* No `priority` on these: the hero image is the LCP element and this
            section starts below the fold, so competing for the same first bytes
            would only slow the thing being measured. */}
        <ul
          className={`mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto py-2 md:grid md:overflow-visible xl:gap-8 ${columnsFor(projects.length)}`}
        >
          {projects.map((project) => (
            <li key={project.slug} className="w-[82vw] shrink-0 snap-start md:w-auto">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

        <p className="mt-8">
          <Button variant="text" href="/projects">
            View all projects
          </Button>
        </p>
      </Container>
    </Section>
  );
}
