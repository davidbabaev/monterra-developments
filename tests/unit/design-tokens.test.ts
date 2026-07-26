import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BRAND_COLORS, DERIVED_COLORS } from "@/lib/design-tokens";

/**
 * app/globals.css is the source of truth for the palette. lib/design-tokens.ts
 * mirrors it so the styleguide can compute contrast in TypeScript. This test is
 * what stops the two drifting apart.
 */

const globalsCss = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

function declaredValue(variable: string): string | null {
  const match = globalsCss.match(new RegExp(`${variable}\\s*:\\s*([^;]+);`));
  return match === null ? null : match[1].trim().toLowerCase();
}

describe("design tokens mirror app/globals.css", () => {
  it.each([...BRAND_COLORS, ...DERIVED_COLORS])(
    "$name matches the value declared in globals.css",
    (color) => {
      expect(declaredValue(color.variable)).toBe(color.hex.toLowerCase());
    },
  );

  it("declares exactly the seven brand colours", () => {
    expect(BRAND_COLORS.map((color) => color.name)).toEqual([
      "navy",
      "stone",
      "bronze",
      "ivory",
      "surface",
      "ink",
      "slate",
    ]);
  });
});

describe("globals.css declares the layout and radius tokens", () => {
  it.each([
    ["--radius-sm", "2px"],
    ["--radius-md", "4px"],
    ["--radius-lg", "6px"],
    ["--space-section-mobile", "64px"],
    ["--space-section-tablet", "88px"],
    ["--space-section-desktop", "120px"],
    ["--overlap-offset", "40px"],
  ])("%s is %s", (variable, expected) => {
    expect(declaredValue(variable)).toBe(expected);
  });
});

describe("the font variables are wired through @theme", () => {
  it.each([
    ["--font-display", "var(--font-manrope)"],
    ["--font-body", "var(--font-inter)"],
    ["--font-editorial", "var(--font-cormorant)"],
  ])("%s resolves to %s", (variable, expected) => {
    expect(declaredValue(variable)).toBe(expected);
  });
});
