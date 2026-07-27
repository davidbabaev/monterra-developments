/**
 * A directions link, which is all the map on a project page needs to be.
 *
 * There is no embedded interactive map anywhere on this site: it costs an API
 * key and a large script for negligible value on a brochure page. A static
 * image plus this link does the same job for free.
 */

export type Coords = {
  readonly lat: number;
  readonly lng: number;
};

export function directionsUrl({ lat, lng }: Coords): string {
  // Both halves are numbers off a validated schema, so there is nothing to escape.
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
