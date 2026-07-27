import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { openAndWaitFor } from "./support/interactions";

/**
 * The launch gate: zero critical and zero serious violations on every page, and
 * on the two components a closed-state scan would never reach.
 *
 * Moderate and minor counts are printed rather than asserted. They are worth
 * knowing and worth fixing, but blocking a launch on a "best practice" rule that
 * axe itself does not class as an accessibility failure buys nothing.
 */

const PAGES = [
  "/",
  "/projects",
  "/projects/monterra-ridge",
  "/projects/monterra-bay",
  "/contact",
  "/team",
  "/about",
  "/process",
] as const;

type Severity = "critical" | "serious" | "moderate" | "minor";

const EMPTY: Record<Severity, number> = { critical: 0, serious: 0, moderate: 0, minor: 0 };

async function scan(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const counts = { ...EMPTY };
  for (const violation of results.violations) {
    const impact = (violation.impact ?? "minor") as Severity;
    counts[impact] += violation.nodes.length;
  }

  const detail = results.violations
    .map((violation) => `${violation.impact}: ${violation.id} (${violation.nodes.length})`)
    .join(", ");

  // Printed so the report can quote real numbers rather than "it passed".
  console.log(`[axe] ${label} ${JSON.stringify(counts)}${detail === "" ? "" : ` — ${detail}`}`);

  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(
    blocking.map((violation) => `${violation.id}: ${violation.help}`),
    `${label} has critical or serious violations`,
  ).toEqual([]);
}

for (const path of PAGES) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await scan(page, path);
  });
}

/**
 * Heading order, which the WCAG tag set does not cover — axe files it under
 * best-practice, so a scan restricted to wcag2a/aa is silent about it while
 * Lighthouse marks it down. Three pages were stepping straight from the page
 * title to an h3 before this was checked.
 */
test("no page skips a heading level", async ({ page }) => {
  const routes = [...PAGES, "/projects/the-larkin", "/privacy"];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((heading) =>
        Number(heading.tagName.slice(1)),
      ),
    );

    const skips: string[] = [];
    levels.forEach((level, index) => {
      const previous = levels[index - 1];
      if (previous !== undefined && level > previous + 1) skips.push(`h${previous} to h${level}`);
    });

    expect(skips, `${route} skips a heading level`).toEqual([]);
  }
});

test("axe: the lightbox, open", async ({ page }) => {
  await page.goto("/projects/the-larkin", { waitUntil: "load" });

  await openAndWaitFor(
    page.getByRole("button", { name: /view larger/i }).nth(2),
    page.getByRole("dialog"),
  );

  await scan(page, "lightbox (open)");
});

test("axe: the mobile nav, open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "load" });

  await openAndWaitFor(
    page.getByRole("button", { name: "Open menu" }),
    page.getByRole("dialog", { name: "Main menu" }),
  );

  await scan(page, "mobile nav (open)");
});
