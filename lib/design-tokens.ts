import type { ContrastUsage } from "./contrast";

/**
 * A mirror of the palette in app/globals.css, for the styleguide's contrast
 * table. app/globals.css is the source of truth; tests/unit/design-tokens.test.ts
 * parses that file and fails if these values drift from it.
 */

export type BrandColor = {
  readonly name: string;
  readonly variable: string;
  readonly hex: string;
  readonly role: string;
};

export const BRAND_COLORS: readonly BrandColor[] = [
  { name: "navy", variable: "--color-navy", hex: "#14263d", role: "Headings, footer, primary buttons" },
  { name: "stone", variable: "--color-stone", hex: "#c8b9a3", role: "Slabs, borders, section backgrounds" },
  { name: "bronze", variable: "--color-bronze", hex: "#a87842", role: "Lede words, active states, rules" },
  { name: "ivory", variable: "--color-ivory", hex: "#f7f5f0", role: "Page background" },
  { name: "surface", variable: "--color-surface", hex: "#ffffff", role: "Cards" },
  { name: "ink", variable: "--color-ink", hex: "#252a30", role: "Body text" },
  { name: "slate", variable: "--color-slate", hex: "#66707a", role: "Metadata, labels, captions" },
];

/**
 * The accessible variant of bronze, not an eighth brand colour. Filled
 * backgrounds behind white text only — never text, border, rule or icon.
 * See docs/design-reference.md section 3.1.
 */
export const DERIVED_COLORS: readonly BrandColor[] = [
  {
    name: "bronze-deep",
    variable: "--color-bronze-deep",
    hex: "#976c3b",
    role: "Accessible variant of bronze. Filled background behind white text only.",
  },
];

export type ContrastPair = {
  readonly foreground: string;
  readonly background: string;
  readonly usage: ContrastUsage;
  /** Where in the system this pair actually appears. */
  readonly where: string;
};

const hexOf = (name: string): string => {
  const color = [...BRAND_COLORS, ...DERIVED_COLORS].find((entry) => entry.name === name);
  if (color === undefined) throw new Error(`Unknown brand colour "${name}"`);
  return color.hex;
};

type PairSpec = readonly [foreground: string, background: string, usage: ContrastUsage, where: string];

/**
 * Every foreground/background pair the system actually renders. The styleguide
 * displays each with its measured ratio, and a unit test asserts every one of
 * them clears its stated requirement — so a failing pair breaks the build's
 * test step rather than merely looking wrong on a page.
 */
const PAIR_SPECS: readonly PairSpec[] = [
  ["navy", "ivory", "text", "Headings and h3 on the page background"],
  ["navy", "surface", "text", "Card titles"],
  ["navy", "stone", "text", "All heading text on a stone slab"],
  ["ink", "ivory", "text", "Body copy"],
  ["ink", "surface", "text", "Body copy inside a card"],
  ["ink", "stone", "text", "Body copy on a stone slab"],
  ["slate", "ivory", "text", "Eyebrow, metadata, captions"],
  ["slate", "surface", "text", "Metadata inside a card"],
  ["ivory", "navy", "text", "Primary button label, footer text, mobile nav links"],
  ["stone", "navy", "text", "Footer column headings and copyright bar"],
  ["surface", "navy", "text", "StatusBadge: completed"],
  ["navy", "stone", "text", "StatusBadge: upcoming"],
  ["surface", "bronze-deep", "text", "StatusBadge: current"],
  ["bronze", "ivory", "largeText", "SplitHeading lede (26px minimum)"],
  ["bronze", "surface", "largeText", "SplitHeading lede on a card"],
  ["bronze", "navy", "largeText", "SplitHeading lede on a dark scrim"],
  ["bronze", "ivory", "nonText", "Focus rings, hairline rules, AmenityMarker"],
  ["bronze", "navy", "nonText", "Primary button arrow"],
  ["bronze", "surface", "nonText", "Card call-to-action arrow, prev/next direction arrow"],
  /**
   * Stone is 1.76:1 on ivory, so it can only ever be a decorative edge. A card
   * is identified by its content and its hover state, not by its border, so
   * 1.4.11 does not bite. A form input is the opposite case — there the border
   * is the only thing identifying the control, so inputs take a navy border.
   */
  ["stone", "ivory", "decorative", "Card border — the content identifies the card, not the edge"],
  ["navy", "ivory", "nonText", "Form input borders — stone is too faint to identify a control"],
  ["stone", "ivory", "decorative", "SectionNumeral — aria-hidden, never the only cue"],
  ["bronze", "stone", "decorative", "PullQuote attribution rule — aria-hidden"],
];

export const CONTRAST_PAIRS: readonly ContrastPair[] = PAIR_SPECS.map(
  ([foreground, background, usage, where]) => ({
    foreground: hexOf(foreground),
    background: hexOf(background),
    usage,
    where,
  }),
);

/** Names alongside the hexes, for labelling rows in the styleguide table. */
export const CONTRAST_PAIR_NAMES: readonly { fg: string; bg: string }[] = PAIR_SPECS.map(
  ([foreground, background]) => ({ fg: foreground, bg: background }),
);

export type TypeScaleEntry = {
  readonly role: string;
  readonly font: string;
  readonly size: string;
  readonly weight: string;
  readonly color: string;
  readonly className: string;
};

export const TYPE_SCALE: readonly TypeScaleEntry[] = [
  {
    role: "h1 — rest",
    font: "Manrope",
    size: "32 → 52px",
    weight: "600",
    color: "navy",
    className: "font-display text-[32px] font-semibold tracking-[-0.02em] text-navy xl:text-[52px]",
  },
  {
    role: "h2 — rest",
    font: "Manrope",
    size: "26 → 38px",
    weight: "600",
    color: "navy",
    className: "font-display text-[26px] font-semibold tracking-[-0.02em] text-navy xl:text-[38px]",
  },
  {
    role: "h3",
    font: "Manrope",
    size: "19 → 22px",
    weight: "600",
    color: "navy",
    className: "font-display text-[19px] font-semibold text-navy xl:text-[22px]",
  },
  {
    role: "Body",
    font: "Inter",
    size: "16 → 17px",
    weight: "400",
    color: "ink",
    className: "font-body text-[16px] leading-[1.65] text-ink xl:text-[17px]",
  },
  {
    role: "Body intro",
    font: "Inter",
    size: "18 → 20px",
    weight: "400",
    color: "slate",
    className: "font-body text-[18px] leading-[1.6] text-slate xl:text-[20px]",
  },
  {
    role: "Metadata / label",
    font: "Inter",
    size: "13px",
    weight: "500",
    color: "slate",
    className: "font-body text-[13px] font-medium uppercase tracking-[0.04em] text-slate",
  },
];
