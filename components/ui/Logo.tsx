import { cx } from "@/lib/cx";
import { siteConfig } from "@/lib/site";
import { LOCKUP_VIEWBOX, LOGO_PATHS, LOGO_VIEWBOX, MARK_VIEWBOX } from "./logoPaths";

/**
 * [REPLACE] — this is the auto-traced mark, optimised but not redrawn. The
 * geometry still carries tracer artefacts (wobbly stems, a soft "N" in the
 * strapline). A proper vector redraw is owed before launch; when it lands, only
 * logoPaths.ts changes.
 *
 * Inlined rather than served as a file so the navy half can be painted with
 * currentColor, which is what lets one set of geometry invert on a dark
 * surface. The bronze half is fixed: it is the accent in every variant.
 */

/**
 * `full` is the supplied artwork exactly, strapline included, and needs roughly
 * 60px of height before that strapline is legible. `horizontal` drops it, which
 * is what any header-sized use wants.
 */
type LogoShape = "full" | "horizontal" | "monogram";
type LogoTone = "light" | "dark";

const VIEWBOX: Record<LogoShape, string> = {
  full: LOGO_VIEWBOX,
  horizontal: LOCKUP_VIEWBOX,
  monogram: MARK_VIEWBOX,
};

type LogoProps = {
  readonly shape?: LogoShape;
  /** `dark` means "sits on a dark surface", so the navy half becomes ivory. */
  readonly tone?: LogoTone;
  /**
   * Decorative when a text label sits beside it. Otherwise the mark is the
   * accessible name of whatever wraps it, usually the home link.
   */
  readonly decorative?: boolean;
  readonly className?: string;
};

export function Logo({
  shape = "horizontal",
  tone = "light",
  decorative = false,
  className,
}: LogoProps) {
  const paths = LOGO_PATHS.filter((path) => {
    if (shape === "monogram") return path.inMark;
    if (shape === "horizontal") return !path.inStrapline;
    return true;
  });
  const label = shape === "monogram" ? `${siteConfig.name} monogram` : siteConfig.name;

  return (
    <svg
      viewBox={VIEWBOX[shape]}
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? "true" : undefined}
      focusable="false"
      className={cx(tone === "dark" ? "text-ivory" : "text-navy", className)}
    >
      {paths.map((path) => (
        <path
          key={path.d}
          d={path.d}
          fill={path.tone === "primary" ? "currentColor" : "var(--color-bronze)"}
        />
      ))}
    </svg>
  );
}
