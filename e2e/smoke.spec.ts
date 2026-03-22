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

test("redirects unauthenticated workspace routes to login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Log in to expensify" }),
  ).toBeVisible();

  await page.goto("/chat");
  await expect(page).toHaveURL(/\/login$/);
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
  await expect(page.getByLabel("First Name")).toBeVisible();
  await expect(page.getByLabel("Last Name")).toBeVisible();
  await expect(page.getByLabel("Confirm Password")).toBeVisible();
});
