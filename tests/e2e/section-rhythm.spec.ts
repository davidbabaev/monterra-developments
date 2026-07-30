import { expect, test, type Page } from "@playwright/test";

/**
 * Two sections on the same background read as one interval; a change of
 * background keeps a full interval on both sides of the colour edge.
 *
 * Measured as computed padding rather than as a gap between boxes, because a
 * gap can be produced by a dozen things and only one of them is the rule under
 * test.
 */

/** The rhythm tokens: 64 / 88 / 120px. */
const paddingFor = (width: number) => (width >= 1280 ? 120 : width >= 768 ? 88 : 64);

type SectionBox = {
  readonly surface: string;
  readonly paddingTop: number;
  readonly paddingBottom: number;
};

async function sections(page: Page): Promise<SectionBox[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("main [data-section-surface]")].map((element) => {
      const style = getComputedStyle(element);
      return {
        surface: element.getAttribute("data-section-surface") ?? "",
        paddingTop: Math.round(parseFloat(style.paddingTop)),
        paddingBottom: Math.round(parseFloat(style.paddingBottom)),
      };
    }),
  );
}

const WIDTHS = [390, 768, 1280];

test.describe("section rhythm", () => {
  for (const width of WIDTHS) {
    test(`home collapses same-surface gaps and keeps the colour break at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const found = await sections(page);
      const full = paddingFor(width);

      // Positioning, featured, stats, process, closing.
      expect(found).toHaveLength(5);

      // First section after the hero, which is not a Section and declares no
      // surface: the interval survives.
      expect(found[0]).toEqual({ surface: "page", paddingTop: full, paddingBottom: full });

      // The three ivory sections that follow an ivory section.
      for (const section of found.slice(1, 4)) {
        expect(section).toEqual({ surface: "page", paddingTop: 0, paddingBottom: full });
      }

      // The navy band follows an ivory section, so the break keeps its room.
      expect(found[4]).toEqual({ surface: "navy", paddingTop: full, paddingBottom: full });
    });

    test(`a project detail page keeps every interval at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/projects/monterra-ridge", { waitUntil: "domcontentloaded" });

      const found = await sections(page);
      const full = paddingFor(width);

      // Content (ivory), inquiry (navy), prev/next (ivory): every neighbour is a
      // change of background, so nothing collapses.
      expect(found.map((section) => section.surface)).toEqual(["page", "navy", "page"]);
      for (const section of found) {
        expect(section.paddingTop).toBe(full);
        expect(section.paddingBottom).toBe(full);
      }
    });

    test(`a page with one section keeps both its edges at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/projects", { waitUntil: "domcontentloaded" });

      const found = await sections(page);
      const full = paddingFor(width);

      expect(found).toHaveLength(1);
      expect(found[0]?.paddingTop).toBe(full);
      expect(found[0]?.paddingBottom).toBe(full);
    });

    test(`about collapses its ivory run and keeps the colour break at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/about", { waitUntil: "domcontentloaded" });

      const found = await sections(page);
      const full = paddingFor(width);

      // Story, values, quote, team photo, stats, then the navy band.
      expect(found).toHaveLength(6);

      // The first follows the hero, which declares no surface, so it keeps its
      // interval; the four ivory sections after it collapse; the band does not.
      expect(found[0]).toEqual({ surface: "page", paddingTop: full, paddingBottom: full });
      for (const section of found.slice(1, 5)) {
        expect(section).toEqual({ surface: "page", paddingTop: 0, paddingBottom: full });
      }
      expect(found[5]).toEqual({ surface: "navy", paddingTop: full, paddingBottom: full });
    });

    test(`no page scrolls horizontally after the change at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });

      for (const path of [
        "/",
        "/projects",
        "/projects/monterra-ridge",
        "/about",
        "/process",
        "/team",
        "/privacy",
      ]) {
        await page.goto(path, { waitUntil: "domcontentloaded" });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("the measured gap between two ivory sections is one interval, not two", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const gap = await page.evaluate(() => {
      const found = [...document.querySelectorAll('main [data-section-surface="page"]')];
      const first = found[0].getBoundingClientRect();
      const second = found[1].getBoundingClientRect();
      const firstStyle = getComputedStyle(found[0]);
      const secondStyle = getComputedStyle(found[1]);

      return {
        boxesTouch: Math.round(second.top - first.bottom),
        whitespace:
          Math.round(parseFloat(firstStyle.paddingBottom)) +
          Math.round(parseFloat(secondStyle.paddingTop)),
      };
    });

    expect(gap.boxesTouch).toBe(0);
    expect(gap.whitespace).toBe(120);
  });
});
