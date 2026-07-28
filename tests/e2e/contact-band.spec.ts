import { expect, test } from "@playwright/test";

/**
 * The contact band sits above the footer on every route except the one that
 * already lists the same details twice.
 */

const ROUTES_WITH_BAND = [
  "/",
  "/projects",
  "/projects/monterra-ridge",
  "/about",
  "/process",
  "/team",
  "/privacy",
  "/styleguide",
];

/**
 * By landmark role, not by tag or position.
 *
 * This used to be `#site-content > div`, which stopped matching the moment the
 * band became an `aside` — and every assertion using it was `toHaveCount(0)`, so
 * it would have kept passing while testing nothing.
 */
const band = (page: import("@playwright/test").Page) =>
  page.getByRole("complementary", { name: "Contact details" });

for (const route of ROUTES_WITH_BAND) {
  test(`the contact band is present on ${route}`, async ({ page }) => {
    await page.goto(route);

    const office = page.getByRole("heading", { level: 2, name: "Office" });
    await expect(office).toHaveCount(1);
    await expect(office).toBeVisible();

    // The landmark itself, which is how the band is reached by landmark
    // navigation rather than by scrolling to the bottom of the page.
    await expect(band(page)).toHaveCount(1);
    await expect(band(page)).toBeVisible();
  });
}

test("the contact band is absent on /contact, where the details already appear twice", async ({
  page,
}) => {
  await page.goto("/contact");

  // The band's heading level is h2; the form's own column uses h3, and the
  // footer's contact column uses an eyebrow.
  await expect(page.getByRole("heading", { level: 2, name: "Office" })).toHaveCount(0);
  await expect(band(page)).toHaveCount(0);

  // The details are still reachable: once beside the form, once in the footer.
  await expect(page.getByRole("link", { name: /555-0142/ })).toHaveCount(2);
});
