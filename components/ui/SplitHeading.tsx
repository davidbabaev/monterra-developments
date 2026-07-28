import { cx } from "@/lib/cx";

/**
 * The signature element: every h1 and h2 splits across two typefaces and two
 * colours — an editorial serif lede in bronze, the remainder in navy Manrope.
 *
 * Both parts are inline in one line box, so they share a baseline by
 * construction. The lede is set larger to compensate for Cormorant's smaller
 * cap height and bring the two into optical alignment.
 *
 * The design reference suggests ~8%. Measured against the real webfonts, that
 * is not enough: Manrope 600 has a cap height of 0.735em and Cormorant
 * Garamond 300 has 0.625em, so matching them needs 1.176. Rounded to 1.18,
 * which leaves the caps 0.3% apart — invisible at any rendered size.
 *
 * Never used below h2: h3 and smaller are Manrope alone.
 */

type SplitHeadingProps = {
  /** One or two words, always real words from the heading. */
  readonly lede: string;
  /**
   * The remainder, in Manrope. Empty only for a heading that is a single word
   * and cannot be split — "Build", the fourth stage of Our Process. Such a
   * heading is all lede, and the trailing space is dropped so it does not leave
   * a stray text node after the span.
   */
  readonly rest: string;
  readonly as?: "h1" | "h2";
  /** `dark` is for navy scrims: the lede stays bronze, the remainder goes ivory. */
  readonly variant?: "light" | "dark";
  readonly className?: string;
};

/**
 * Smallest rendered size is 26px (h2 mobile), which keeps the bronze lede at
 * WCAG large-text where its 3.55:1 on ivory is compliant.
 */
const SIZE_BY_LEVEL = {
  h1: "text-[32px] md:text-[42px] xl:text-[52px]",
  h2: "text-[26px] md:text-[32px] xl:text-[38px]",
} as const;

export function SplitHeading({
  lede,
  rest,
  as = "h2",
  variant = "light",
  className,
}: SplitHeadingProps) {
  const Heading = as;

  return (
    <Heading
      className={cx(
        "font-display font-semibold leading-[1.15] tracking-[-0.02em] text-balance",
        SIZE_BY_LEVEL[as],
        variant === "dark" ? "text-ivory" : "text-navy",
        className,
      )}
    >
      <span className="font-editorial text-[1.18em] font-light text-bronze">{lede}</span>
      {rest === "" ? null : <> {rest}</>}
    </Heading>
  );
}
