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

/**
 * The opaque colour that results from painting `foreground` at `alpha` over
 * `background`.
 *
 * Translucent surfaces — the scrolled header at ivory/92, the hero subhead at
 * ivory/88 — have to be measured as what the eye actually receives, not as the
 * token they were written with.
 */
export function blendOver(foreground: string, alpha: number, background: string): string {
  if (alpha < 0 || alpha > 1) throw new Error(`Alpha must be between 0 and 1, received ${alpha}`);

  const channels = (hex: string) => {
    const value = parseInt(hex.replace("#", ""), 16);
    return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
  };

  const [fr, fg, fb] = channels(foreground);
  const [br, bg, bb] = channels(background);

  const mix = (f: number, b: number) => Math.round(f * alpha + b * (1 - alpha));

  return `#${[mix(fr, br), mix(fg, bg), mix(fb, bb)]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Two decimals, the precision WCAG reporting conventionally uses. */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
