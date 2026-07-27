import { cx } from "@/lib/cx";

/**
 * The LinkedIn mark, drawn here rather than imported.
 *
 * lucide-react carries no brand icons — they were split out of the set — and
 * pulling in a second icon package for one glyph is not worth a dependency. The
 * path is inline for the same reason logoPaths.ts is: it is a fixed piece of
 * geometry, not something to fetch.
 *
 * It is the one filled icon in a stroked set, and deliberately so: a brand mark
 * redrawn as a 1.5px outline stops being the brand mark, which defeats the only
 * reason to show it. Like every other icon here it is aria-hidden and always
 * accompanied by a text label, so it never carries meaning on its own.
 */

type LinkedInMarkProps = {
  readonly size?: number;
  readonly className?: string;
};

export function LinkedInMark({ size = 20, className }: LinkedInMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cx("shrink-0", className)}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
