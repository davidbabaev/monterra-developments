import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { imageSize } from "image-size";
import { describe, expect, it } from "vitest";
import { CompanyStory } from "@/components/about/CompanyStory";

/**
 * The photograph in the About story slot, which is the only photograph on the
 * page since the second group shot was removed on 2026-08-02.
 *
 * Two things are worth pinning: the file, so the ratio and the weight cannot
 * drift when someone re-exports it, and the intrinsic box the component
 * declares, so it stays the file's own and nothing shifts on load.
 *
 * check-image-sizes.mjs already fails the build over a megabyte. This is the
 * tighter budget for this one asset — it is below the fold and has no business
 * costing what a hero costs.
 */

const FILE = path.join(process.cwd(), "public", "about", "story.webp");

/** 400KB, from the brief. */
const LIMIT_BYTES = 400 * 1024;

describe("the story image asset", () => {
  /**
   * 1200 is the widest the offset slot can request: the container caps at
   * 1200px, so the column renders at most 527 CSS px and a 2x screen resolves
   * the 1200 candidate. Anything wider would never be fetched.
   */
  it("is 1200 wide at 16:9, so the declared box is the real one", () => {
    const { width, height } = imageSize(readFileSync(FILE));

    expect(width).toBe(1200);
    expect(height).toBe(675);
    expect(width / height).toBeCloseTo(16 / 9, 3);
  });

  it("stays under the weight budget for something below the fold", () => {
    expect(statSync(FILE).size).toBeLessThan(LIMIT_BYTES);
  });
});

describe("CompanyStory", () => {
  it("carries one photograph, the story image", () => {
    const { container } = render(<CompanyStory />);
    const images = container.querySelectorAll("img");

    expect(images).toHaveLength(1);
    expect(images[0].getAttribute("src")).toMatch(/story\.webp/);
  });

  /**
   * The placeholder alt named a specific building — the first duplex — which
   * this photograph is not. This asserts the replacement describes the frame:
   * the people, the room and what is on the table.
   */
  it("describes what is actually in the photograph", () => {
    render(<CompanyStory />);
    const alt = screen.getByRole("img").getAttribute("alt") ?? "";

    expect(alt).toMatch(/four/i);
    expect(alt).toMatch(/scale models/i);
    expect(alt).toMatch(/skyline/i);
    expect(alt).not.toMatch(/duplex/i);
    expect(alt.length).toBeGreaterThan(80);
  });

  /** Below the fold on every viewport, so it must never claim the preload slot. */
  it("loads lazily rather than with priority", () => {
    render(<CompanyStory />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority", "high");
  });

  it("declares the 16:9 box up front, so nothing below it shifts on load", () => {
    render(<CompanyStory />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "675");
  });
});
