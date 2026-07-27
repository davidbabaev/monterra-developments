import { cx } from "@/lib/cx";

/**
 * Deliberately quieter than the heading it sits above. Only used where the order
 * carries real information — Our Process, and nowhere else.
 *
 * Slate, not the stone the design reference names. Stone on ivory is 1.76:1,
 * which axe reports as a serious failure of 1.4.3 even at 44px, and the audit is
 * right: the numerals were very nearly invisible on screen. "Decorative" was the
 * intent, but a numeral a sighted reader cannot make out is not decorative, it is
 * broken. Slate is 4.87:1 and still far quieter than the navy heading, which is
 * the effect the reference was after.
 *
 * aria-hidden stays: the sequence is carried for assistive technology by the
 * ordered list around it, so the digits are never the only cue.
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
        "block font-display text-[32px] font-semibold leading-none text-slate xl:text-[44px]",
        className,
      )}
    >
      {value}
    </span>
  );
}
