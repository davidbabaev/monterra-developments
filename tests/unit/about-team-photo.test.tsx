import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { imageSize } from "image-size";
import { describe, expect, it } from "vitest";
import { TeamPhoto } from "@/components/about/TeamPhoto";

/**
 * The group photograph on /about. Two things are worth pinning: the markup, so
 * the caption stays attached to the image for a screen reader rather than
 * floating as a loose paragraph, and the file itself, so the ratio and the
 * weight cannot drift when someone re-exports it.
 *
 * check-image-sizes.mjs already fails the build over a megabyte. This is the
 * tighter budget for this one asset — it is below the fold and has no business
 * costing what a hero costs.
 */

const FILE = path.join(process.cwd(), "public", "about", "team-photo.webp");

/** 400KB, from the brief. */
const LIMIT_BYTES = 400 * 1024;

describe("the team photo asset", () => {
  it("is 16:9, so the intrinsic box the component declares is the real one", () => {
    const { width, height } = imageSize(readFileSync(FILE));

    expect(width).toBe(1664);
    expect(height).toBe(936);
    expect(width / height).toBeCloseTo(16 / 9, 3);
  });

  it("stays under the weight budget for something below the fold", () => {
    expect(statSync(FILE).size).toBeLessThan(LIMIT_BYTES);
  });
});

describe("TeamPhoto", () => {
  it("ties the caption to the image with figure and figcaption", () => {
    const { container } = render(<TeamPhoto />);

    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.querySelector("img")).not.toBeNull();
    expect(figure?.querySelector("figcaption")).not.toBeNull();
  });

  it("sets the caption in slate, the declared colour for captions on ivory", () => {
    const { container } = render(<TeamPhoto />);
    expect(container.querySelector("figcaption")).toHaveClass("text-slate");
  });

  /**
   * The placeholder alt on this page described the stage rather than the
   * photograph. This asserts the replacement describes the photograph: the
   * people, what they are wearing, and the room.
   */
  it("describes what is actually in the photograph", () => {
    render(<TeamPhoto />);
    const alt = screen.getByRole("img").getAttribute("alt") ?? "";

    expect(alt).toMatch(/four people/i);
    expect(alt).toMatch(/scale models/i);
    expect(alt).toMatch(/skyline/i);
    expect(alt.length).toBeGreaterThan(80);
  });

  /** Below the fold on every viewport, so it must never claim the preload slot. */
  it("loads lazily rather than with priority", () => {
    render(<TeamPhoto />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority", "high");
  });

  it("declares the 16:9 box up front, so nothing below it shifts on load", () => {
    render(<TeamPhoto />);
    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("width", "1664");
    expect(image).toHaveAttribute("height", "936");
  });
});
