import { expect, test, type Page } from "@playwright/test";

/**
 * Behaviour that only a browser can prove: the three pages load clean, the
 * sparse project renders no empty section, an unknown slug reaches the custom
 * 404, and prev/next wraps.
 */

const SLUGS = ["monterra-ridge", "monterra-bay", "the-larkin"] as const;

/** Console errors, collected before navigation so nothing is missed. */
function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

for (const slug of SLUGS) {
  test(`${slug} loads with no console errors`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(`/projects/${slug}`);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${slug} has exactly one h1 and no horizontal scroll`, async ({ page }) => {
    await page.goto(`/projects/${slug}`);

    await expect(page.locator("h1")).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("Monterra Bay renders no empty optional section", async ({ page }) => {
  await page.goto("/projects/monterra-bay");

  // Nothing it has no data for: no amenities, no gallery, no floor plans.
  await expect(page.getByRole("heading", { name: /what's included/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /gallery/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /floor plans/i })).toHaveCount(0);

  // No map, since it has no coordinates, and no dead directions link.
  await expect(page.getByRole("link", { name: /directions/i })).toHaveCount(0);

  // The spec table is two rows, and neither is blank.
  const values = page.locator("dd");
  await expect(values).toHaveCount(2);
  for (const text of await values.allTextContents()) {
    expect(text.trim()).not.toBe("");
  }

  // What it does have.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Monterra Bay");
  await expect(page.getByRole("heading", { name: /the location/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /development status/i })).toBeVisible();
});

test("Monterra Ridge shows a download only for the plan that has a PDF", async ({ page }) => {
  await page.goto("/projects/monterra-ridge");

  await expect(page.getByRole("heading", { name: /floor plans/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan A" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan B" })).toBeVisible();

  const downloads = page.getByRole("link", { name: /download pdf/i });
  await expect(downloads).toHaveCount(1);
  await expect(downloads.first()).toHaveAttribute("href", /plan-a\.pdf$/);
  await expect(downloads.first()).toHaveAttribute("rel", /noopener/);
});

test("prev/next wraps from the last project to the first", async ({ page }) => {
  await page.goto("/projects/the-larkin");

  const next = page.getByRole("link", { name: /next project/i });
  await expect(next).toHaveAttribute("href", "/projects/monterra-ridge");

  await next.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Monterra Ridge");
});

test("the inquiry CTA carries the project into the contact route", async ({ page }) => {
  await page.goto("/projects/monterra-ridge");

  await expect(page.getByRole("link", { name: /contact us about this project/i })).toHaveAttribute(
    "href",
    "/contact?project=monterra-ridge",
  );
});

test("an unknown slug renders the custom 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-project");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.getByRole("link", { name: /view projects/i })).toBeVisible();
});

test("the spec panel is sticky from 1024px and static below it", async ({ page }) => {
  await page.goto("/projects/monterra-ridge");

  const panel = page.getByRole("heading", { name: "Specifications" }).locator("..");
  const position = await panel.evaluate((element) => {
    const style = getComputedStyle(element.parentElement as HTMLElement);
    return { position: style.position, top: style.top };
  });

  const isDesktop = (page.viewportSize()?.width ?? 0) >= 1024;

  if (isDesktop) {
    expect(position).toEqual({ position: "sticky", top: "96px" });
  } else {
    expect(position.position).toBe("static");
  }
});

test("the spec panel sits above the prose in a single column", async ({ page }) => {
  await page.goto("/projects/monterra-bay");
  test.skip((page.viewportSize()?.width ?? 0) >= 1024, "two columns from 1024px");

  const panelTop = await page
    .getByRole("heading", { name: "Specifications" })
    .evaluate((element) => element.getBoundingClientRect().top);
  const proseTop = await page
    .locator("p", { hasText: /trying to buy since 2021/ })
    .first()
    .evaluate((element) => element.getBoundingClientRect().top);

  expect(panelTop).toBeLessThan(proseTop);
});

test("the status tracker names its active stage rather than only colouring it", async ({ page }) => {
  await page.goto("/projects/monterra-ridge");

  const active = page.locator('[aria-current="step"]');
  await expect(active).toHaveCount(1);
  await expect(active).toContainText("Current");
  // The line beneath is keyed to the status alone — it no longer repeats the
  // project title, which the heading and breadcrumb have already given.
  await expect(page.getByText("Under construction.", { exact: true })).toBeVisible();
});
