import { expect, test } from "@playwright/test";

/**
 * The contrast rules that can only be checked against real rendered CSS.
 *
 * lib/design-tokens.ts declares which colour pairs are allowed; these sweep the
 * live DOM for the rules that depend on computed size and inherited background,
 * which a token list cannot see.
 */

const BRONZE = "rgb(168, 120, 66)";
const STONE = "rgb(200, 185, 163)";
const SLATE = "rgb(102, 112, 122)";
const WHITE = "rgb(255, 255, 255)";

/** This project's floor for bronze text, stricter than WCAG's 24px. */
const BRONZE_MIN_PX = 26;

const PAGES = ["/styleguide", "/about", "/projects"];

type Offender = {
  text: string;
  fontSize: number;
  tag: string;
  className: string;
};

/**
 * Only elements that render their own text are considered, and anything
 * decorative is skipped — the primary button's arrow is an aria-hidden glyph,
 * not text.
 */
async function findBronzeTextBelowMinimum(page: import("@playwright/test").Page, min: number) {
  return page.evaluate(
    ({ bronze, minPx }) => {
      const offenders: Offender[] = [];
      for (const element of document.querySelectorAll<HTMLElement>("body *")) {
        if (element.closest('[aria-hidden="true"]') !== null) continue;
        // Styleguide colour specimens render pairs at sizes the rules forbid on
        // purpose — that is what an audit table is for.
        if (element.closest("[data-contrast-sample]") !== null) continue;

        const ownText = [...element.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent?.trim() ?? "")
          .join("")
          .trim();
        if (ownText === "") continue;

        const styles = getComputedStyle(element);
        if (styles.color !== bronze) continue;

        const fontSize = parseFloat(styles.fontSize);
        if (fontSize >= minPx) continue;

        offenders.push({
          text: ownText.slice(0, 40),
          fontSize,
          tag: element.tagName.toLowerCase(),
          className: element.className.toString().slice(0, 80),
        });
      }
      return offenders;
    },
    { bronze: BRONZE, minPx: min },
  ) as Promise<Offender[]>;
}

test.describe("bronze is never small text", () => {
  for (const path of PAGES) {
    test(`${path} has no bronze text under ${BRONZE_MIN_PX}px`, async ({ page }) => {
      await page.goto(path);
      const offenders = await findBronzeTextBelowMinimum(page, BRONZE_MIN_PX);
      expect(
        offenders,
        `bronze text below ${BRONZE_MIN_PX}px: ${JSON.stringify(offenders, null, 2)}`,
      ).toEqual([]);
    });
  }

  test("the stat unit clears the floor at the smallest figure size", async ({ page }) => {
    await page.goto("/styleguide");
    const unit = page.getByText("m²").first();
    const { fontSize, color } = await unit.evaluate((element) => {
      const styles = getComputedStyle(element);
      return { fontSize: parseFloat(styles.fontSize), color: styles.color };
    });

    expect(color).toBe(BRONZE);
    expect(fontSize).toBeGreaterThanOrEqual(BRONZE_MIN_PX);
  });
});

test.describe("nothing illegible sits on stone", () => {
  test("no white or slate text on a stone background", async ({ page }) => {
    await page.goto("/about");

    const offenders = await page.evaluate(
      ({ stone, slate, white }) => {
        const found: { text: string; color: string; tag: string }[] = [];

        const backgroundOf = (element: HTMLElement): string => {
          let node: HTMLElement | null = element;
          while (node !== null) {
            const background = getComputedStyle(node).backgroundColor;
            if (background !== "rgba(0, 0, 0, 0)" && background !== "transparent") return background;
            node = node.parentElement;
          }
          return "";
        };

        for (const element of document.querySelectorAll<HTMLElement>("body *")) {
          const ownText = [...element.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent?.trim() ?? "")
            .join("")
            .trim();
          if (ownText === "") continue;

          const { color } = getComputedStyle(element);
          if (color !== slate && color !== white) continue;
          if (backgroundOf(element) !== stone) continue;

          found.push({ text: ownText.slice(0, 40), color, tag: element.tagName.toLowerCase() });
        }
        return found;
      },
      { stone: STONE, slate: SLATE, white: WHITE },
    );

    expect(offenders, `white or slate on stone: ${JSON.stringify(offenders, null, 2)}`).toEqual([]);
  });
});
