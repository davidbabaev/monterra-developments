import { describe, expect, it } from "vitest";
import {
  CONTRAST_THRESHOLDS,
  contrastRatio,
  formatRatio,
  meetsRequirement,
  relativeLuminance,
} from "@/lib/contrast";
import { BRAND_COLORS, CONTRAST_PAIRS, CONTRAST_PAIR_NAMES } from "@/lib/design-tokens";

describe("contrastRatio", () => {
  it("gives 21:1 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("gives 1:1 for a colour against itself", () => {
    expect(contrastRatio("#14263d", "#14263d")).toBeCloseTo(1, 5);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#14263d", "#f7f5f0")).toBeCloseTo(
      contrastRatio("#f7f5f0", "#14263d"),
      10,
    );
  });

  it("accepts hexes with or without the leading hash", () => {
    expect(contrastRatio("14263d", "#f7f5f0")).toBeCloseTo(contrastRatio("#14263d", "#f7f5f0"), 10);
  });

  it("rejects a malformed colour rather than silently returning a number", () => {
    expect(() => relativeLuminance("#12345")).toThrow(/6-digit hex/);
    expect(() => relativeLuminance("navy")).toThrow(/6-digit hex/);
  });

  it("matches known values for the brand pairs", () => {
    expect(contrastRatio("#14263d", "#f7f5f0")).toBeCloseTo(14.02, 1);
    expect(contrastRatio("#a87842", "#f7f5f0")).toBeCloseTo(3.55, 1);
    expect(contrastRatio("#66707a", "#c8b9a3")).toBeCloseTo(2.62, 1);
  });
});

describe("formatRatio", () => {
  it("renders two decimals with the ratio suffix", () => {
    expect(formatRatio(4.5)).toBe("4.50:1");
  });
});

describe("meetsRequirement", () => {
  it("holds small text to 4.5 and large text to 3", () => {
    expect(meetsRequirement(4.5, "text")).toBe(true);
    expect(meetsRequirement(4.49, "text")).toBe(false);
    expect(meetsRequirement(3, "largeText")).toBe(true);
    expect(meetsRequirement(2.99, "largeText")).toBe(false);
  });

  it("exempts decorative pairs", () => {
    expect(meetsRequirement(1.76, "decorative")).toBe(true);
  });
});

/**
 * The enforcement test. Every pair the system renders has to clear the
 * requirement for the way it is used — a regression here fails the suite, so
 * the contrast rules cannot quietly rot into documentation.
 */
describe("the system's declared contrast pairs", () => {
  it.each(
    CONTRAST_PAIRS.map((pair, index) => ({
      ...pair,
      ...CONTRAST_PAIR_NAMES[index],
    })),
  )("$fg on $bg ($usage) clears its requirement — $where", (pair) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    expect(
      ratio,
      `${pair.fg} on ${pair.bg} measures ${formatRatio(ratio)}, below the ` +
        `${CONTRAST_THRESHOLDS[pair.usage]}:1 required for ${pair.usage}`,
    ).toBeGreaterThanOrEqual(CONTRAST_THRESHOLDS[pair.usage]);
  });
});

describe("forbidden combinations stay forbidden", () => {
  const hexOf = (name: string) => BRAND_COLORS.find((color) => color.name === name)?.hex ?? "";

  it("white on stone fails, which is why it is banned", () => {
    expect(contrastRatio("#ffffff", hexOf("stone"))).toBeLessThan(CONTRAST_THRESHOLDS.text);
  });

  it("slate on stone fails, which is why it is banned", () => {
    expect(contrastRatio(hexOf("slate"), hexOf("stone"))).toBeLessThan(CONTRAST_THRESHOLDS.text);
  });

  it("bronze cannot carry small text on any surface in the palette", () => {
    for (const surface of ["ivory", "surface", "navy", "stone"]) {
      expect(contrastRatio(hexOf("bronze"), hexOf(surface))).toBeLessThan(
        CONTRAST_THRESHOLDS.text,
      );
    }
  });
});
