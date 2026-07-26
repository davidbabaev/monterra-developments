/**
 * WCAG 2.1 contrast maths. Pure functions over hex strings — no DOM, so the
 * styleguide computes real ratios at build time and the unit tests assert them.
 */

/** Minimum ratio each kind of usage must clear. */
export const CONTRAST_THRESHOLDS = {
  /** Body copy, labels, small links — anything under 24px (or 18.66px bold). */
  text: 4.5,
  /** Text at 24px+, or 18.66px+ bold. */
  largeText: 3,
  /** Rules, borders, icons, focus rings — WCAG 1.4.11. */
  nonText: 3,
  /**
   * Purely decorative and never the only carrier of meaning. WCAG 1.4.3
   * exempts these; the ratio is still displayed so the choice stays visible.
   */
  decorative: 0,
} as const;

export type ContrastUsage = keyof typeof CONTRAST_THRESHOLDS;

function channelLuminance(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error(`Expected a 6-digit hex colour, received "${hex}"`);
  }
  const value = parseInt(normalized, 16);
  return (
    0.2126 * channelLuminance((value >> 16) & 0xff) +
    0.7152 * channelLuminance((value >> 8) & 0xff) +
    0.0722 * channelLuminance(value & 0xff)
  );
}

/** Order-independent: contrast is symmetric. */
export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsRequirement(ratio: number, usage: ContrastUsage): boolean {
  return ratio >= CONTRAST_THRESHOLDS[usage];
}

/** Two decimals, the precision WCAG reporting conventionally uses. */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
