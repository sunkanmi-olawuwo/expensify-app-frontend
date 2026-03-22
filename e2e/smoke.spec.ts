import { expect, test } from "@playwright/test";

test("redirects root to dashboard and keeps chat out of the visible nav", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Transactions" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Chat" })).toHaveCount(0);
});

test("navigates between primary routes and loads chat by direct URL", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Transactions" }).click();
  await expect(page).toHaveURL(/\/transactions$/);

  await page.getByRole("link", { name: "Analytics" }).click();
  await expect(page).toHaveURL(/\/analytics$/);

  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page).toHaveURL(/\/settings$/);

  await page.goto("/chat");
  await expect(page.getByText("Route scaffold only")).toBeVisible();
});
