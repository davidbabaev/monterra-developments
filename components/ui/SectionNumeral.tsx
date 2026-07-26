import { cx } from "@/lib/cx";

/**
 * Stone, deliberately quieter than the heading it sits above. Only used where
 * the order carries real information — Our Process, and nowhere else.
 *
 * aria-hidden: stone on ivory is 1.76:1, so this is decorative by construction
 * and must never be the only thing conveying sequence. The surrounding content
 * carries the order for assistive technology.
 */

type SectionNumeralProps = {
  /** Already formatted, e.g. "01". */
  readonly value: string;
  readonly className?: string;
};

export function SectionNumeral({ value, className }: SectionNumeralProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "block font-display text-[32px] font-semibold leading-none text-stone xl:text-[44px]",
        className,
      )}
    >
      {value}
    </span>
  );
}
