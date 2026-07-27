import { AmenityMarker } from "@/components/ui/AmenityMarker";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * Amenities are optional and free text. A project without them renders nothing
 * at all — not a heading over an empty list.
 *
 * Each row is marked with the bronze hairline dash rather than a per-amenity
 * icon: the labels are authored prose, so no icon set would cover them
 * reliably, and the misses would look broken next to the hits.
 */

type AmenityListProps = {
  readonly amenities?: readonly string[];
};

export function AmenityList({ amenities }: AmenityListProps) {
  if (amenities === undefined || amenities.length === 0) return null;

  return (
    <section>
      <SplitHeading as="h2" lede="What's" rest="included" />
      <ul className="mt-8 grid gap-3 lg:grid-cols-2 lg:gap-x-12">
        {amenities.map((amenity) => (
          <li
            key={amenity}
            className="flex gap-3 font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]"
          >
            <AmenityMarker />
            <span>{amenity}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
