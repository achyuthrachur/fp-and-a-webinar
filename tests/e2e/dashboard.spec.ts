import { test, expect } from "@playwright/test";

test("dashboard shell renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("NorthRiver Distribution Group")).toBeVisible();
});
