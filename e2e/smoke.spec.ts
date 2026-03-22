import { expect, test } from "@playwright/test";

test("renders the public home page and keeps chat out of the visible nav", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "A monthly money story with enough room to think.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Get Started" }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Log In" }),
  ).toBeVisible();
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

test("renders login and signup forms", async ({ page }) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Log in to expensify" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();

  await page.goto("/signup");
  await expect(
    page.getByRole("heading", { name: "Create your expensify account" }),
  ).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Confirm Password")).toBeVisible();
});
