import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes = ["/", "/portfolio", "/partners", "/media-kit", "/expeditions", "/prints/painted-silence", "/services", "/about", "/contact"];
for (const route of publicRoutes) {
  test(`${route} has no automatically detectable WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("admin overview has no automatically detectable WCAG A/AA violations", async ({ browser }) => {
  const context = await browser.newContext({
    extraHTTPHeaders: { "x-e2e-authenticated-user-email": "michael.kennedy@ku.edu" },
  });
  const page = await context.newPage();
  await page.goto("/admin");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
  await context.close();
});
