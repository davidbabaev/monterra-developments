import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "@/components/ui/Logo";
import { LOCKUP_VIEWBOX, LOGO_PATHS, LOGO_VIEWBOX, MARK_VIEWBOX } from "@/components/ui/logoPaths";

const svgOf = (container: HTMLElement) => container.querySelector("svg");
const pathsOf = (container: HTMLElement) => [...container.querySelectorAll("path")];

describe("logo geometry", () => {
  it("is snapped to exactly the two brand colours, with no trace palette left", () => {
    const fills = new Set(
      LOGO_PATHS.map((path) => (path.tone === "primary" ? "primary" : "accent")),
    );
    expect([...fills].sort()).toEqual(["accent", "primary"]);
  });

  it("splits into a mark, a wordmark and a strapline", () => {
    expect(LOGO_PATHS.filter((path) => path.inMark).length).toBeGreaterThan(0);
    expect(LOGO_PATHS.filter((path) => !path.inMark).length).toBeGreaterThan(0);
    expect(LOGO_PATHS.filter((path) => path.inStrapline).length).toBeGreaterThan(0);
  });

  it("never marks a path as both the skyline and the strapline", () => {
    expect(LOGO_PATHS.filter((path) => path.inMark && path.inStrapline)).toHaveLength(0);
  });
});

describe("Logo", () => {
  it("renders every path for the full artwork", () => {
    const { container } = render(<Logo shape="full" />);
    expect(pathsOf(container)).toHaveLength(LOGO_PATHS.length);
    expect(svgOf(container)).toHaveAttribute("viewBox", LOGO_VIEWBOX);
  });

  it("drops the strapline for the horizontal lockup", () => {
    const { container } = render(<Logo shape="horizontal" />);
    expect(pathsOf(container)).toHaveLength(
      LOGO_PATHS.filter((path) => !path.inStrapline).length,
    );
    expect(svgOf(container)).toHaveAttribute("viewBox", LOCKUP_VIEWBOX);
  });

  it("renders only the mark for the monogram, cropped to its own bounds", () => {
    const { container } = render(<Logo shape="monogram" />);
    expect(pathsOf(container)).toHaveLength(LOGO_PATHS.filter((path) => path.inMark).length);
    expect(svgOf(container)).toHaveAttribute("viewBox", MARK_VIEWBOX);
  });

  it("paints the navy half with currentColor so it can invert", () => {
    const { container } = render(<Logo />);
    const fills = new Set(pathsOf(container).map((path) => path.getAttribute("fill")));
    expect(fills).toContain("currentColor");
    expect(fills).toContain("var(--color-bronze)");
    // No literal colour survives into the markup.
    expect([...fills].some((fill) => fill?.startsWith("#"))).toBe(false);
  });

  it("keeps the bronze accent fixed when the tone inverts", () => {
    const { container } = render(<Logo tone="dark" />);
    expect(svgOf(container)).toHaveClass("text-ivory");
    const accents = pathsOf(container).filter(
      (path) => path.getAttribute("fill") === "var(--color-bronze)",
    );
    expect(accents.length).toBeGreaterThan(0);
  });

  it("is navy on a light surface", () => {
    const { container } = render(<Logo />);
    expect(svgOf(container)).toHaveClass("text-navy");
  });

  it("exposes an accessible name by default", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "Monterra Developments" })).toBeInTheDocument();
  });

  it("is hidden from assistive tech when a text label sits beside it", () => {
    const { container } = render(<Logo decorative />);
    expect(svgOf(container)).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
