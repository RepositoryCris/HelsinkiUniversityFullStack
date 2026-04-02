const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const mainLoginTitle = page.getByText("Log in to application");
    await expect(mainLoginTitle).toBeVisible();

    const usernameLocator = page.locator('input[type="text"]');
    await expect(usernameLocator).toBeVisible();

    const passwordLocator = page.locator('input[type="password"]');
    await expect(passwordLocator).toBeVisible();

    const labelUsername = page.getByLabel("username");
    await expect(labelUsername).toBeVisible();

    const labelPassword = page.getByLabel("password");
    await expect(labelPassword).toBeVisible();

    const loginButton = page.getByRole("button", { name: "login" });
    await expect(loginButton).toBeVisible();
  });
});
