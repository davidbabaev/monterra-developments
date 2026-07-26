/**
 * A 12px bronze hairline dash, used in place of a bullet.
 *
 * Deliberately not a per-amenity icon: amenities are free text, so no icon
 * lookup would cover them reliably and the misses would look broken.
 */

export function AmenityMarker() {
  return <span aria-hidden="true" className="mt-[0.7em] block h-px w-3 shrink-0 bg-bronze" />;
}
