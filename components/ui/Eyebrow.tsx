import { cx } from "@/lib/cx";

/** Small uppercase label that sits above a heading. */

type EyebrowProps = {
  /**
   * `h2` for a block that is a real section of the page and has to appear in the
   * heading outline while staying visually quiet — a spec panel's label, where a
   * 38px h2 would shout down the content it introduces.
   */
  readonly as?: "p" | "h2" | "h3";
  /**
   * A prop rather than a `text-navy` passed through `className`: that would
   * collide with the default `text-slate` at equal specificity and be resolved
   * by stylesheet order. `onStone` exists because slate on stone is 2.62:1 and
   * forbidden.
   */
  readonly tone?: "default" | "onStone";
  readonly className?: string;
  readonly children: React.ReactNode;
};

const TONE = {
  default: "text-slate",
  onStone: "text-navy",
} as const;

export function Eyebrow({ as = "p", tone = "default", className, children }: EyebrowProps) {
  const Element = as;

  return (
    <Element
      className={cx(
        "font-display text-[12px] font-semibold uppercase tracking-[0.14em]",
        TONE[tone],
        className,
      )}
    >
      {children}
    </Element>
  );
}
