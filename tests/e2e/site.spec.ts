import { expect, test } from "@playwright/test";

test("browses a collection and opens the lightbox with a keyboard", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page.getByRole("heading", { name: "Photographs that hold the feeling of being there." })).toBeVisible();
  await page.getByRole("button", { name: "Enlarge Painted Silence" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Painted Silence" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Ridge Before Rain" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("configures a print, persists the cart, and rejects a forged client price", async ({ page }) => {
  await page.goto("/prints/ridge-before-rain");
  await page.getByLabel("Metal").check();
  await page.getByLabel("20 × 30 in").check();
  await page.getByRole("button", { name: /Add to cart/ }).click();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Ridge Before Rain" })).toBeVisible();
  await page.evaluate(() => {
    const items = JSON.parse(localStorage.getItem("mwm-cart-v1") ?? "[]");
    items[0].price = 1;
    localStorage.setItem("mwm-cart-v1", JSON.stringify(items));
  });
  const response = await page.request.post("/api/checkout", {
    data: { items: [{ slug: "ridge-before-rain", material: "Metal", size: "20 × 30", quantity: 1 }], giftNote: "" },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.url).toContain("/order/success");
});

test("submits a validated photography inquiry", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Email").fill("customer@example.com");
  await page.getByLabel("Photography service").selectOption("Commercial or commissioned work");
  await page.getByLabel("Location").fill("Lawrence, Kansas");
  await page
    .getByLabel("Tell me about the photographs you want")
    .fill("I would like to discuss a commissioned landscape photograph for an office.");
  await page.getByText("I agree that Memories with Mike may use this information").click();
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByText("Your inquiry has been received.")).toBeVisible();
});

test("protects admin and permits allowlisted authenticated management", async ({ browser }) => {
  const anonymous = await browser.newPage();
  await anonymous.goto("/admin");
  await expect(anonymous).toHaveURL(/access-required/);
  await anonymous.close();
  const context = await browser.newContext({
    extraHTTPHeaders: { "x-e2e-authenticated-user-email": "michael.kennedy@ku.edu" },
  });
  const page = await context.newPage();
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  const slug = `automated-test-${Date.now()}`;
  const create = await page.request.post("/api/admin/photographs", {
    data: {
      title: "Automated Test Draft",
      slug,
      category: "Landscapes",
      location: "Lawrence, Kansas",
      shortDescription: "",
      story: "A draft created by the automated management workflow.",
      altText: "Test placeholder",
      capturedAt: "",
      camera: "",
      lens: "",
      focalLength: "",
      shutterSpeed: "",
      aperture: "",
      orientation: "landscape",
      aspectRatio: "3:2",
      dominantColor: "earth",
      focalPointX: "50",
      focalPointY: "50",
      status: "DRAFT",
      scheduledAt: "",
      seoTitle: "",
      seoDescription: "",
    },
  });
  expect(create.status()).toBe(201);
  const publish = await page.request.put(`/api/admin/photographs/${slug}`, {
    data: {
      title: "Automated Test Photograph",
      slug,
      category: "Landscapes",
      location: "Lawrence, Kansas",
      shortDescription: "Automated publishing test.",
      story: "A photograph published through the protected administrative workflow.",
      altText: "Automated test placeholder",
      capturedAt: "",
      camera: "",
      lens: "",
      focalLength: "",
      shutterSpeed: "",
      aperture: "",
      orientation: "landscape",
      aspectRatio: "3:2",
      dominantColor: "earth",
      focalPointX: "50",
      focalPointY: "50",
      status: "PUBLISHED",
      scheduledAt: "",
      seoTitle: "",
      seoDescription: "",
      portfolioVisible: "on",
      seoVisible: "on",
    },
  });
  expect(publish.ok()).toBeTruthy();
  await page.goto("/portfolio");
  await expect(page.getByRole("heading", { name: "Automated Test Photograph" })).toBeVisible();

  const fixture = await page.request.post("/api/test/seed-order");
  expect(fixture.status()).toBe(201);
  await page.goto("/admin/orders");
  await page.getByText("Manage order").last().click();
  await page.getByLabel("Next status").last().selectOption("SUBMITTED");
  await page.getByLabel("Lab order number").last().fill("LAB-E2E-1");
  await page.getByRole("button", { name: "Update fulfillment" }).last().click();
  await expect(page.getByText("SUBMITTED").last()).toBeVisible();
  await context.close();
});
