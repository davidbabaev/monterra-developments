/**
 * Splits a project title into the two halves SplitHeading needs: a one-word
 * editorial lede and the Manrope remainder.
 *
 * The design reference requires the lede to be a real word from the heading, so
 * it is taken rather than invented — the first word, which reads as intended for
 * every seeded title ("Monterra Ridge", "Monterra Bay", "The Larkin").
 *
 * A one-word title has no remainder. The whole title becomes the lede rather
 * than leaving an empty half: at h1 sizes bronze is above the 24px threshold
 * where it clears WCAG, so an all-Cormorant title is compliant, if unusual.
 */

export type SplitTitle = {
  readonly lede: string;
  readonly rest: string;
};

export function splitProjectTitle(title: string): SplitTitle {
  const words = title.trim().split(/\s+/);
  const [first, ...remainder] = words;

  return { lede: first ?? title, rest: remainder.join(" ") };
}
