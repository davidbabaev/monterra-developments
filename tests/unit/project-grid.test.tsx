import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import type { ProjectCardData } from "@/components/project/projectCardData";

/**
 * The grid's only real decision is which card gets `priority`.
 *
 * Exactly one does — the first. Three used to, and the three preloads raced
 * each other so the card that is actually the LCP element finished later for
 * it. The flag follows grid position rather than a slug, so this asserts the
 * position and never the project.
 */

const cardFor = (slug: string): ProjectCardData => ({
  slug,
  title: slug,
  status: "current",
  city: "Austin",
  state: "TX",
  propertyTypes: ["Townhomes"],
  hero: { src: `/projects/${slug}/hero.webp`, alt: `${slug} hero`, width: 1920, height: 1072 },
});

const imagesOf = (container: HTMLElement) => [...container.querySelectorAll("img")];

describe("ProjectGrid image priority", () => {
  it("gives the first card priority and lazy-loads every other one", () => {
    const { container } = render(<ProjectGrid projects={["a", "b", "c"].map(cardFor)} />);
    const [first, ...rest] = imagesOf(container);

    expect(first).not.toHaveAttribute("loading", "lazy");
    expect(rest).toHaveLength(2);
    for (const image of rest) {
      expect(image).toHaveAttribute("loading", "lazy");
    }
  });

  /**
   * The listing filters client-side, so the first card is whichever project
   * survives the filter — not whichever one is first in the unfiltered order.
   */
  it("follows grid position, so a reordered list moves the flag with it", () => {
    const { container } = render(<ProjectGrid projects={["c", "a"].map(cardFor)} />);
    const [first, second] = imagesOf(container);

    // next/image rewrites src through the optimizer, so the slug is encoded.
    expect(decodeURIComponent(first.getAttribute("src") ?? "")).toContain("/projects/c/hero.webp");
    expect(first).not.toHaveAttribute("loading", "lazy");
    expect(second).toHaveAttribute("loading", "lazy");
  });

  it("gives a single-card grid exactly one priority image", () => {
    const { container } = render(<ProjectGrid projects={[cardFor("only")]} />);
    const images = imagesOf(container);

    expect(images).toHaveLength(1);
    expect(images[0]).not.toHaveAttribute("loading", "lazy");
  });
});
