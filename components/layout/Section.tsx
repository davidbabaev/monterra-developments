import { cx } from "@/lib/cx";

/**
 * Vertical rhythm straight from the tokens: 64 / 88 / 120px.
 * Renders a plain div when the content is not a landmark section.
 *
 * Two sections that share a background collapse the gap between them to one
 * section's worth of padding rather than two. That is done in CSS, in
 * app/globals.css, keyed on the `data-section-surface` attribute set here — a
 * section should not have to be told what precedes it, and a prop would have to
 * be re-threaded by hand every time sections are reordered.
 *
 * The background comes from `surface` rather than a `className`, because the
 * rule can only pair like with like if the surface is declared rather than
 * inferred from an arbitrary class string.
 */

type SectionSurface = "page" | "navy";

type SectionProps = {
  readonly as?: "section" | "div";
  /** `navy` is the full-bleed dark band; `page` inherits the ivory body. */
  readonly surface?: SectionSurface;
  readonly className?: string;
  readonly children: React.ReactNode;
};

const PADDING =
  "py-[var(--space-section-mobile)] md:py-[var(--space-section-tablet)] xl:py-[var(--space-section-desktop)]";

const SURFACE: Record<SectionSurface, string> = {
  page: "",
  navy: "bg-navy",
};

export function Section({ as = "section", surface = "page", className, children }: SectionProps) {
  const Element = as;

  return (
    <Element data-section-surface={surface} className={cx(PADDING, SURFACE[surface], className)}>
      {children}
    </Element>
  );
}
