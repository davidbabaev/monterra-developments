import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { imageSize } from "image-size";
import { describe, expect, it } from "vitest";
import { Positioning } from "@/components/home/Positioning";

/**
 * The photograph in the homepage positioning slot, which replaced the solid
 * colour placeholder on 2026-08-02.
 *
 * Pinned the same way as the About story image, because it sits in the same
 * `OffsetFeature` slot at the same widths: the file, so the ratio and the
 * weight cannot drift on a re-export, and the intrinsic box the component
 * declares, so it stays the file's own and nothing shifts on load.
 */

const FILE = path.join(process.cwd(), "public", "home", "positioning.webp");

/** 400KB, from the brief. */
const LIMIT_BYTES = 400 * 1024;

describe("the positioning image asset", () => {
  /**
   * 1200 is the widest the offset slot can request: the container caps at
   * 1200px, so the column renders at most 527 CSS px and a 2x screen resolves
   * the 1200 candidate. Anything wider would never be fetched.
   *
   * The height is not 675 as it is on `/about`. The supplied frame is 2752x1536
   * — 1.792, not 16:9 — and it was resized whole rather than cropped to a ratio
   * the slot does not impose. `OffsetFeature` gives the image no aspect box, so
   * the file's own ratio is what renders.
   */
  it("is 1200 wide and keeps the source frame's ratio", () => {
    const { width, height } = imageSize(readFileSync(FILE));

    expect(width).toBe(1200);
    expect(height).toBe(670);
    expect(width / height).toBeCloseTo(2752 / 1536, 2);
  });

  it("stays under the weight budget for something below the fold", () => {
    expect(statSync(FILE).size).toBeLessThan(LIMIT_BYTES);
  });
});

describe("Positioning", () => {
  it("carries one photograph, the positioning image", () => {
    const { container } = render(<Positioning />);
    const images = container.querySelectorAll("img");

    expect(images).toHaveLength(1);
    expect(images[0].getAttribute("src")).toMatch(/positioning\.webp/);
  });

  /**
   * The placeholder alt described a completed street on a clear afternoon,
   * which this photograph is not — it is a site mid-build. This asserts the
   * replacement describes the frame: the people, what they are doing and what
   * is behind them.
   */
  it("describes what is actually in the photograph", () => {
    render(<Positioning />);
    const alt = screen.getByRole("img").getAttribute("alt") ?? "";

    expect(alt).toMatch(/three/i);
    expect(alt).toMatch(/hard hats/i);
    expect(alt).toMatch(/drawings/i);
    expect(alt).toMatch(/crane/i);
    expect(alt).not.toMatch(/completed street/i);
    expect(alt.length).toBeGreaterThan(80);
  });

  /** Below the fold on every viewport, so it must never claim the preload slot. */
  it("loads lazily rather than with priority", () => {
    render(<Positioning />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority", "high");
  });

  it("declares the box up front, so nothing below it shifts on load", () => {
    render(<Positioning />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "670");
  });
});
