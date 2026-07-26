import { cx } from "@/lib/cx";

/**
 * Vertical rhythm straight from the tokens: 64 / 88 / 120px.
 * Renders a plain div when the content is not a landmark section.
 */

type SectionProps = {
  readonly as?: "section" | "div";
  readonly className?: string;
  readonly children: React.ReactNode;
};

const PADDING =
  "py-[var(--space-section-mobile)] md:py-[var(--space-section-tablet)] xl:py-[var(--space-section-desktop)]";

export function Section({ as = "section", className, children }: SectionProps) {
  const Element = as;
  return <Element className={cx(PADDING, className)}>{children}</Element>;
}
