import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cx } from "@/lib/cx";
import { directionsUrl } from "@/lib/directions";
import type { Project } from "@/lib/project-loader";

/**
 * City, state and — when it exists — the street address, plus a static map and
 * a directions link when the project carries coordinates.
 *
 * No embedded map: see lib/directions.ts. A project with no coordinates renders
 * the address block alone rather than an empty map frame, and one with no
 * address renders just the city and state, which every project has.
 */

type LocationBlockProps = {
  readonly location: Project["location"];
};

/**
 * A solid placeholder at a map's aspect ratio, standing in for a rendered static
 * map exactly as the hero images stand in for photography. The image is still a
 * placeholder; its alt text is approved and describes what the real map shows.
 */
const MAP_PLACEHOLDER = {
  src: "/map/static-map-placeholder.png",
  width: 1200,
  height: 675,
} as const;

export function LocationBlock({ location }: LocationBlockProps) {
  const { city, state, address, coords } = location;
  const hasMap = coords !== undefined;

  return (
    <section>
      <SplitHeading as="h2" lede="The" rest="location" />

      <div className={cx("mt-8 grid gap-8", hasMap && "lg:grid-cols-2 lg:items-start lg:gap-12")}>
        <address className="font-body text-[16px] leading-[1.65] not-italic text-ink xl:text-[17px]">
          {address !== undefined && <span className="block">{address}</span>}
          <span className="block">
            {city}, {state}
          </span>
        </address>

        {coords !== undefined && (
          <div className="flex flex-col items-start gap-4">
            <Image
              src={MAP_PLACEHOLDER.src}
              alt="Map showing the project location"
              width={MAP_PLACEHOLDER.width}
              height={MAP_PLACEHOLDER.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full border border-stone"
            />
            <Button variant="secondary" href={directionsUrl(coords)} newTab>
              Open directions
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
