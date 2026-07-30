import { expect, test, type Page } from "@playwright/test";

/**
 * About, Our Process, Team and Privacy. What is checked here is what only a
 * browser can settle: that the offset composition collapses, that the process
 * stages alternate, that a touch device gets colour portraits, and that no page
 * ends up with two h1s or a sideways scrollbar.
 */

const PAGES = ["/about", "/process", "/team", "/privacy"] as const;

const overflowOf = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

for (const path of PAGES) {
  test(`${path} has exactly one h1 and never scrolls sideways`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);

    for (const width of [320, 390, 768, 1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await overflowOf(page), `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("about collapses its offset composition below 768px, like home", async ({ page }) => {
  await page.goto("/about");

  // Scoped to the composition: the breadcrumb slab under the hero is also stone.
  const composition = page
    .locator("section")
    .filter({ has: page.locator("img[src*='story-placeholder']") })
    .last();
  const slab = composition.locator(".bg-stone").first();
  const rule = composition.locator(".bg-bronze").first();
  const image = page.locator("img[src*='story-placeholder']");
  const isWide = (page.viewportSize()?.width ?? 0) >= 768;

  if (isWide) {
    await expect(slab).toBeVisible();
    await expect(rule).toBeHidden();

    const slabBox = await slab.boundingBox();
    const imageBox = await image.boundingBox();
    expect(imageBox!.x - slabBox!.x).toBeGreaterThan(30);
    expect(imageBox!.y - slabBox!.y).toBeGreaterThan(30);
  } else {
    await expect(slab).toBeHidden();
    await expect(rule).toBeVisible();
    expect(Math.round((await rule.boundingBox())!.height)).toBe(6);
  }
});

test("about reuses the quote, the stats band and the closing band", async ({ page }) => {
  await page.goto("/about");

  await expect(page.getByRole("blockquote")).toHaveCount(1);
  await expect(page.getByText("Homes delivered")).toBeVisible();
  await expect(page.getByRole("link", { name: /contact us/i }).last()).toHaveAttribute(
    "href",
    "/contact",
  );
});

/**
 * The group photograph. It runs the container measure rather than the half
 * column the offset composition uses, so what a browser has to settle is the
 * width it actually resolves to and the fact that the 16:9 box survives the
 * gutter stepping at every viewport.
 */
test("the team photo runs the container measure at 16:9, between the quote and the stats", async ({
  page,
}) => {
  await page.goto("/about");

  const figure = page.locator("figure").filter({ has: page.locator("img[src*='team-photo']") });
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toBeVisible();

  const image = figure.locator("img");
  await expect(image).toHaveJSProperty("complete", true);

  const width = page.viewportSize()?.width ?? 0;
  // The container is 1200px with the gutter stepping 20 / 40 / 64px.
  const expected = Math.min(width, 1200) - (width >= 1280 ? 128 : width >= 768 ? 80 : 40);

  const box = (await image.boundingBox())!;
  expect(Math.round(box.width)).toBe(expected);
  expect(box.width / box.height).toBeCloseTo(16 / 9, 2);

  const quote = (await page.getByRole("blockquote").boundingBox())!;
  const stats = (await page.getByText("Homes delivered").boundingBox())!;
  expect(box.y).toBeGreaterThan(quote.y + quote.height);
  expect(box.y + box.height).toBeLessThan(stats.y);

  await expect(image).toHaveAttribute("alt", /.{80,}/);
  await expect(figure.locator("figcaption")).toBeVisible();
});

test("the process stages are numbered 01 to 05 and alternate sides", async ({ page }) => {
  await page.goto("/process");

  const numerals = page.locator("main [aria-hidden='true']").filter({ hasText: /^0\d$/ });
  await expect(numerals).toHaveCount(5);
  expect(await numerals.allTextContents()).toEqual(["01", "02", "03", "04", "05"]);

  const isWide = (page.viewportSize()?.width ?? 0) >= 768;

  const sides = await page.evaluate(() => {
    const stages = [...document.querySelectorAll("ol[aria-label=\"Our process\"] > li")];
    return stages.map((stage) => {
      const image = stage.querySelector("img")!.getBoundingClientRect();
      const text = stage.querySelector("h2")!.getBoundingClientRect();
      return image.x < text.x ? "image-left" : "image-right";
    });
  });

  if (isWide) {
    // Alternating, starting with the image on the left.
    expect(sides).toEqual([
      "image-left",
      "image-right",
      "image-left",
      "image-right",
      "image-left",
    ]);
  } else {
    // Stacked: every image starts at the same x as its words.
    const stacked = await page.evaluate(() =>
      [...document.querySelectorAll("ol[aria-label=\"Our process\"] > li")].every((stage) => {
        const image = stage.querySelector("img")!.getBoundingClientRect();
        const text = stage.querySelector("h2")!.getBoundingClientRect();
        return Math.abs(image.x - text.x) < 2 && image.y < text.y;
      }),
    );
    expect(stacked).toBe(true);
  }
});

test("only the process page carries numerals", async ({ page }) => {
  for (const path of ["/about", "/team", "/privacy", "/projects"]) {
    await page.goto(path);
    const numerals = page.locator("main [aria-hidden='true']").filter({ hasText: /^0\d$/ });
    await expect(numerals, `numerals on ${path}`).toHaveCount(0);
  }
});

/**
 * Both card paths render, derived from the seed rather than hardcoded.
 *
 * This used to assert "4 members, 3 links" and broke the moment the seed moved
 * to two with and two without — a content change failing a layout test tells
 * nobody anything. What matters is that a member with a linkedin field gets an
 * anchor and a member without one gets no anchor and no orphaned icon.
 */
test("the team grid shows a link only for the members who have one", async ({ page }) => {
  await page.goto("/team");

  const members = page.locator('ul[aria-label="Team"] > li');
  const total = await members.count();
  expect(total).toBeGreaterThan(1);

  const withLink: number[] = [];
  const withoutLink: number[] = [];

  for (let index = 0; index < total; index += 1) {
    const anchors = await members.nth(index).locator("a").count();
    (anchors > 0 ? withLink : withoutLink).push(index);
  }

  // Both paths have to be exercised by the seed, or one of them ships untested.
  expect(withLink.length, "no member has a linkedin link").toBeGreaterThan(0);
  expect(withoutLink.length, "every member has a linkedin link").toBeGreaterThan(0);

  const linked = members.nth(withLink[0]!);
  await expect(linked.locator("a")).toHaveAccessibleName(/on LinkedIn/);

  // No anchor and no orphaned icon on a member without one.
  const unlinked = members.nth(withoutLink[0]!);
  await expect(unlinked.locator("a")).toHaveCount(0);
  await expect(unlinked.locator("svg")).toHaveCount(0);
});

test.describe("team portraits on a touch device", () => {
  test.use({ hasTouch: true, isMobile: true });

  test("are full colour, because hover can never fire there", async ({ page }) => {
    await page.goto("/team");

    const filters = await page.evaluate(() =>
      [...document.querySelectorAll("ul[aria-label=\"Team\"] > li img")].map(
        (image) => getComputedStyle(image).filter,
      ),
    );

    expect(filters).toHaveLength(4);
    for (const filter of filters) expect(filter).toBe("none");
  });
});

test("team portraits are greyscale at rest where hovering is possible", async ({ page }) => {
  await page.goto("/team");
  test.skip((page.viewportSize()?.width ?? 0) < 768, "checked on the desktop project");

  const filter = await page
    .locator("main ul > li img")
    .first()
    .evaluate((image) => getComputedStyle(image).filter);

  expect(filter).toContain("grayscale");
});

test("privacy is a single prose column at the 68ch measure", async ({ page }) => {
  await page.goto("/privacy");

  const column = page.locator("main .max-w-\\[68ch\\]");
  await expect(column).toHaveCount(1);

  // A clause count, not the clause count — the policy is allowed to grow.
  const clauses = page.locator("main").getByRole("heading", { level: 2 });
  expect(await clauses.count()).toBeGreaterThanOrEqual(5);

  // The page has to keep saying it is a concept and that nothing is processed.
  // This is the one page where a visitor decides whether to trust the form.
  await expect(page.getByText(/concept project and not a real company/i)).toBeVisible();
  await expect(page.getByText(/nothing you type into it is sent, stored or processed/i)).toBeVisible();
});
