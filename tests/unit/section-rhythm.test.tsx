import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "@/components/layout/Section";

/**
 * The collapse itself is a CSS sibling rule, so it is measured in a browser in
 * tests/e2e/section-rhythm.spec.ts. What matters here is the hook that rule
 * depends on: every section declares the surface it sits on, and it declares it
 * as data rather than as an arbitrary background class the CSS cannot read.
 */

describe("Section surface", () => {
  it("declares the page surface by default, with no background of its own", () => {
    render(<Section>Content</Section>);
    const section = screen.getByText("Content");

    expect(section).toHaveAttribute("data-section-surface", "page");
    expect(section.className).not.toContain("bg-");
  });

  it("declares and paints the navy surface from one prop", () => {
    render(<Section surface="navy">Band</Section>);
    const section = screen.getByText("Band");

    expect(section).toHaveAttribute("data-section-surface", "navy");
    expect(section).toHaveClass("bg-navy");
  });

  it("keeps the rhythm tokens on every surface", () => {
    for (const surface of ["page", "navy"] as const) {
      const { unmount } = render(<Section surface={surface}>Padded</Section>);
      expect(screen.getByText("Padded").className).toContain(
        "py-[var(--space-section-mobile)]",
      );
      unmount();
    }
  });

  it("still renders a plain div when asked, so a non-landmark keeps the rhythm", () => {
    render(
      <Section as="div" surface="navy">
        Not a landmark
      </Section>,
    );
    const element = screen.getByText("Not a landmark");

    expect(element.tagName).toBe("DIV");
    expect(element).toHaveAttribute("data-section-surface", "navy");
  });
});
