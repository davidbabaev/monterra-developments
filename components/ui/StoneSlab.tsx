import { cx } from "@/lib/cx";

/**
 * Stone used as a load-bearing block rather than a background tint.
 *
 * Text on stone is navy or ink only — white is 1.9:1 and slate is 2.62:1, both
 * forbidden. Consumers are responsible for that; StatBlock and PullQuote
 * enforce it for their own content.
 */

/**
 * Padding steps up with the viewport. A flat 48px inset is disproportionate at
 * 320px, where it eats a third of the width and forces long strings to overflow.
 */
type SlabPadding = "sm" | "md" | "lg";

type StoneSlabProps = {
  readonly padding?: SlabPadding;
  readonly className?: string;
  readonly children: React.ReactNode;
};

const PADDING: Record<SlabPadding, string> = {
  sm: "p-4 md:p-6",
  md: "p-6 md:p-8",
  lg: "p-6 md:p-8 xl:p-12",
};

export function StoneSlab({ padding = "md", className, children }: StoneSlabProps) {
  return <div className={cx("bg-stone", PADDING[padding], className)}>{children}</div>;
}
