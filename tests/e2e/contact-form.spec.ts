import { expect, test, type Page } from "@playwright/test";

/**
 * The states a form has to be watched in, plus the two things a unit test
 * cannot see: what a focus ring actually renders as, and what the border of an
 * input measures against the page behind it.
 */

const FORCE_FAILURE_TOKEN = "[FORCE-ERROR]";

const nameField = (page: Page) => page.getByLabel(/full name/i);
const emailField = (page: Page) => page.getByLabel(/^email/i);
const phoneField = (page: Page) => page.getByLabel(/phone/i);
const projectField = (page: Page) => page.getByLabel(/project of interest/i);
const messageField = (page: Page) => page.getByLabel(/message/i);
const submit = (page: Page) => page.getByRole("button", { name: /send message|sending/i });

/**
 * Scoped to main: Next keeps its own empty route announcer at role="alert" on
 * every page, so an unscoped query matches that too.
 */
const banner = (page: Page) => page.locator("main").getByRole("alert");

async function fill(page: Page, message: string) {
  await nameField(page).fill("Dana Okafor");
  await emailField(page).fill("dana@example.com");
  await phoneField(page).fill("512 555 0142");
  await messageField(page).fill(message);
}

test("submitting empty shows a message on each required field, correctly associated", async ({
  page,
}) => {
  await page.goto("/contact");
  await submit(page).click();

  for (const [field, expected] of [
    [nameField(page), /enter your full name/i],
    [emailField(page), /email address/i],
    [messageField(page), /at least a sentence/i],
  ] as const) {
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(expected);
  }

  // Nothing was sent: no failure banner, and the form was not replaced by the
  // success panel. Keyed on the panel's own button — "two business days" also
  // appears in the contact band above the footer.
  await expect(banner(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /send another message/i })).toHaveCount(0);
  await expect(nameField(page)).toBeVisible();
});

test("a valid submission goes idle to submitting to success and back", async ({ page }) => {
  await page.goto("/contact");
  await fill(page, "We are looking for a three bedroom near the river.");

  await expect(submit(page)).toBeEnabled();
  await submit(page).click();

  // Submitting: relabelled, disabled, and every field locked.
  await expect(page.getByText("Sending…")).toBeVisible();
  await expect(submit(page)).toBeDisabled();
  await expect(nameField(page)).toBeDisabled();
  await expect(messageField(page)).toBeDisabled();

  // Success: the form is gone, replaced by the panel.
  await expect(page.getByText(/two business days/i)).toBeVisible({ timeout: 5000 });
  await expect(nameField(page)).toHaveCount(0);

  await page.getByRole("button", { name: /send another message/i }).click();
  await expect(nameField(page)).toHaveValue("");
  await expect(submit(page)).toBeEnabled();
});

test("a failed submission keeps every entered value", async ({ page }) => {
  await page.goto("/contact?project=the-larkin");

  const message = `We would like a viewing. ${FORCE_FAILURE_TOKEN}`;
  await fill(page, message);
  await submit(page).click();

  const failure = banner(page);
  await expect(failure).toBeVisible({ timeout: 5000 });
  await expect(failure).toContainText(/something went wrong/i);
  await expect(failure.getByRole("link")).toHaveAttribute("href", /^mailto:/);

  // The banner sits above the form, and the form still holds everything.
  const bannerBox = await failure.boundingBox();
  const formBox = await page.locator("form").boundingBox();
  expect(bannerBox!.y).toBeLessThan(formBox!.y);

  await expect(nameField(page)).toHaveValue("Dana Okafor");
  await expect(emailField(page)).toHaveValue("dana@example.com");
  await expect(phoneField(page)).toHaveValue("512 555 0142");
  await expect(messageField(page)).toHaveValue(message);
  await expect(projectField(page)).toHaveValue("the-larkin");
});

test("arriving from a project's call to action preselects that project", async ({ page }) => {
  await page.goto("/projects/monterra-ridge");
  await page.getByRole("link", { name: /contact us about this project/i }).click();

  await page.waitForURL(/\/contact\?project=monterra-ridge/);
  await expect(projectField(page)).toHaveValue("monterra-ridge");
  await expect(projectField(page).locator("option:checked")).toHaveText("Monterra Ridge");
});

test("an unknown project in the URL falls back to the general option", async ({ page }) => {
  await page.goto("/contact?project=not-a-project");
  await expect(projectField(page)).toHaveValue("general");
});

test("every control is reachable by keyboard with a visible bronze ring", async ({ page }) => {
  await page.goto("/contact");

  const expected = ["full name", "email", "phone", "project of interest", "message"];
  const reached: string[] = [];

  await nameField(page).focus();

  for (let press = 0; press < 12; press += 1) {
    const focused = await page.evaluate(() => {
      const node = document.activeElement as HTMLElement | null;
      if (node === null) return null;
      const style = getComputedStyle(node);
      const labelled = node.id === "" ? null : document.querySelector(`label[for="${node.id}"]`);
      return {
        label: (labelled?.textContent ?? node.textContent ?? "").toLowerCase(),
        outlineColor: style.outlineColor,
        outlineWidth: style.outlineWidth,
        tag: node.tagName.toLowerCase(),
      };
    });

    if (focused === null) break;
    if (["input", "select", "textarea", "button"].includes(focused.tag)) {
      // #A87842 — the same ring every other control on the site uses.
      expect(focused.outlineColor, `ring on ${focused.label}`).toBe("rgb(168, 120, 66)");
      expect(focused.outlineWidth).toBe("2px");
      reached.push(focused.label);
    }

    await page.keyboard.press("Tab");
    await page.waitForTimeout(320);
  }

  for (const label of expected) {
    expect(reached.some((seen) => seen.includes(label)), `${label} was reachable`).toBe(true);
  }
  expect(reached.some((seen) => seen.includes("send message"))).toBe(true);
});

test("input borders clear the 3:1 required of a control boundary", async ({ page }) => {
  await page.goto("/contact");

  const measured = await nameField(page).evaluate((element) => {
    const luminance = (rgb: string) => {
      const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
      const channel = (value: number) => {
        const s = value / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const border = getComputedStyle(element).borderTopColor;
    // The page behind the field, which is what the border has to separate it from.
    const page_ = getComputedStyle(document.body).backgroundColor;
    const [hi, lo] = [luminance(border), luminance(page_)].sort((a, b) => b - a);

    return { border, page: page_, ratio: Number(((hi + 0.05) / (lo + 0.05)).toFixed(2)) };
  });

  expect(measured.ratio).toBeGreaterThanOrEqual(3);
  // Navy, not stone: stone would measure 1.76 and fail.
  expect(measured.border).toBe("rgb(20, 38, 61)");
});

test("the layout is two columns from 1024px and form-first below", async ({ page }) => {
  await page.goto("/contact");

  const formBox = await page.locator("form").boundingBox();
  // Scoped to main: the contact band above the footer also has an Office heading.
  const detailsBox = await page
    .locator("main")
    .getByRole("heading", { name: "Office" })
    .boundingBox();
  const isWide = (page.viewportSize()?.width ?? 0) >= 1024;

  if (isWide) {
    expect(detailsBox!.x).toBeGreaterThan(formBox!.x + formBox!.width - 1);
  } else {
    expect(detailsBox!.y).toBeGreaterThan(formBox!.y);
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
