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

/** Every indexable route. The styleguide is internal and noindex, so it is out. */
const PAGES = [
  "/",
  "/projects",
  "/projects/monterra-ridge",
  "/projects/monterra-bay",
  "/projects/the-larkin",
  "/contact",
  "/team",
  "/about",
  "/process",
  "/privacy",
] as const;

/** The WCAG A and AA tags — the ones that block a launch. */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

type Severity = "critical" | "serious" | "moderate" | "minor";

const EMPTY: Record<Severity, number> = { critical: 0, serious: 0, moderate: 0, minor: 0 };

async function scan(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

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
  for (const route of PAGES) {
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

/**
 * Best-practice rules, reported and never asserted.
 *
 * These are axe's own recommendations rather than WCAG failures — landmark
 * structure, region coverage, heading semantics. They are worth knowing about,
 * and worth a considered decision, but a rule that is not an accessibility
 * failure must not be able to fail a build or quietly drive a code change to
 * satisfy it. Anything this prints goes in the report for a human to rule on.
 */
test("best-practice rules, for information only", async ({ page }) => {
  const findings: string[] = [];

  for (const path of PAGES) {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page })
      .withTags(["best-practice"])
      .analyze();

    for (const violation of results.violations) {
      // The selectors, not just the count — a finding nobody can locate is a
      // finding nobody will rule on.
      const targets = violation.nodes.map((node) => node.target.join(" ")).join(", ");
      findings.push(
        `${path} — ${violation.id} (${violation.impact}, ${violation.nodes.length} node(s)): ${violation.help}\n      nodes: ${targets}`,
      );
    }
  }

  console.log(
    findings.length === 0
      ? "[axe best-practice] no findings across all routes"
      : `[axe best-practice] ${findings.length} finding(s):\n  ${findings.join("\n  ")}`,
  );

  // Deliberately no assertion. See the note above.
  expect(true).toBe(true);
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
