import { expect, test } from "@playwright/test";

import type { Page } from "@playwright/test";

type ResponsiveCase = {
  assertContent: (page: Page) => Promise<void>;
  name: string;
  route: string;
};

const viewports = [
  { height: 740, name: "phone", width: 320 },
  { height: 1024, name: "tablet", width: 768 },
  { height: 800, name: "desktop", width: 1280 },
] as const;

const responsiveCases: ResponsiveCase[] = [
  {
    assertContent: async (page) => {
      await expect(
        page.getByRole("heading", {
          name: "A monthly money story with enough room to think.",
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("main").getByRole("link", { name: "Get Started" }),
      ).toBeVisible();
      await expect(
        page.getByRole("main").getByRole("link", { name: "Log In" }),
      ).toBeVisible();
    },
    name: "home",
    route: "/",
  },
  {
    assertContent: async (page) => {
      await expect(
        page.getByRole("heading", { name: "Log in to expensify" }),
      ).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Log In" }),
      ).toBeVisible();
    },
    name: "login",
    route: "/login",
  },
  {
    assertContent: async (page) => {
      await expect(
        page.getByRole("heading", { name: "Create your expensify account" }),
      ).toBeVisible();
      await expect(page.getByLabel("Name")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Confirm Password")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Sign Up" }),
      ).toBeVisible();
    },
    name: "signup",
    route: "/signup",
  },
];

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    bodyWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(
    dimensions.bodyWidth,
    `Expected no horizontal overflow. viewport=${dimensions.viewportWidth}, body=${dimensions.bodyWidth}`,
  ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
}

async function expectPublicNavigationForViewport(
  page: Page,
  viewportName: string,
) {
  const mobileTrigger = page.getByRole("button", {
    name: "Open public navigation",
  });
  const desktopNavigation = page.getByRole("navigation", {
    name: "Public primary navigation",
  });
  const desktopLogin = desktopNavigation.getByRole("link", {
    name: "Log In",
  });
  const desktopSignup = desktopNavigation.getByRole("link", {
    name: "Get Started",
  });

  if (viewportName === "phone") {
    await expect(mobileTrigger).toBeVisible();
    await expect(desktopLogin).toBeHidden();
    await expect(desktopSignup).toBeHidden();
    return;
  }

  await expect(mobileTrigger).toBeHidden();
  await expect(desktopLogin).toBeVisible();
  await expect(desktopSignup).toBeVisible();
}

for (const viewport of viewports) {
  test.describe(`public responsiveness at ${viewport.name}`, () => {
    test.use({ viewport: { height: viewport.height, width: viewport.width } });

    for (const pageCase of responsiveCases) {
      test(`${pageCase.name} remains responsive`, async ({ page }) => {
        await page.goto(pageCase.route);

        await expectPublicNavigationForViewport(page, viewport.name);
        await pageCase.assertContent(page);
        await expectNoHorizontalOverflow(page);
      });
    }
  });
}
