/**
 * Contrast maths for measurements taken off rendered CSS.
 *
 * lib/contrast.ts does this over hex strings and is the source of truth for the
 * token audit. It cannot be used here: `getComputedStyle` hands back
 * `rgb(r, g, b)`, and also hands back `""` for every property of a detached
 * element and the keyword `transparent` for an unpainted background. Neither is
 * a colour. Parsing that is this file's job.
 *
 * The parse throws naming the offending string rather than returning null. A
 * measurement that cannot be taken has to say what it received — an earlier
 * version asserted non-null and failed as `Cannot read properties of null`,
 * which named neither the value nor the element and cost a diagnosis.
 */

export function parseRgb(value: string): readonly [number, number, number] {
  const channels = value.match(/\d+(?:\.\d+)?/g);

  if (channels === null || channels.length < 3) {
    throw new Error(
      `Not a measurable colour: "${value}". An empty string means the element was ` +
        `detached when it was measured; "transparent" means nothing was painted. ` +
        `Resolve both before calling this.`,
    );
  }

  return [Number(channels[0]), Number(channels[1]), Number(channels[2])] as const;
}

function channelLuminance(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb: string): number {
  const [r, g, b] = parseRgb(rgb);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** Order-independent, as contrast is symmetric. Two decimals, as WCAG reports it. */
export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}
