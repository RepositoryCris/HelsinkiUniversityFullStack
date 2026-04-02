const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // 1. Reset the database
    // Ensure your backend has the /api/testing/reset endpoint enabled!
    await request.post("http://localhost:3003/api/testing/reset");

    // 2. Create a user for the backend
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "crisdev",
        name: "cris junior developer",
        password: "reactrouter",
      },
    });

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

  describe("Login", () => {
    test("fails with wrong credentials", async ({ page }) => {
      const labelUsername = page.getByLabel("username");
      await expect(labelUsername).toBeVisible();
      await labelUsername.fill("crisdev");

      const labelPassword = page.getByLabel("password");
      await expect(labelPassword).toBeVisible();
      await labelPassword.fill("reactrouterwrongpassword");

      const loginButton = page.getByRole("button", { name: "login" });
      await loginButton.click();

      const mainBlogTitle = page.getByText("Blogs");
      await expect(mainBlogTitle).not.toBeVisible();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
      await expect(page.locator(".error")).toHaveText(
        /Wrong username or password/i,
      );

      const errorNotification = page.locator(".notification-error");
      await expect(errorNotification).toContainText(
        "Wrong username or password",
      );

      await expect(errorNotification).toHaveCSS("color", "rgb(183, 28, 28)"); //"#b71c1c"
      await expect(errorNotification).toHaveCSS("border-style", "solid");

      await expect(page.getByText("CRISDEV logged in")).not.toBeVisible();
    });

    test("succeeds with correct credentials", async ({ page }) => {
      const labelUsername = page.getByLabel("username");
      await expect(labelUsername).toBeVisible();
      await labelUsername.fill("crisdev");

      const labelPassword = page.getByLabel("password");
      await expect(labelPassword).toBeVisible();
      await labelPassword.fill("reactrouter");

      const loginButton = page.getByRole("button", { name: "login" });
      await loginButton.click();

      const mainBlogTitle = page.getByText("Blogs");
      await expect(mainBlogTitle).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      const labelUsername = page.getByLabel("username");
      await expect(labelUsername).toBeVisible();
      await labelUsername.fill("crisdev");

      const labelPassword = page.getByLabel("password");
      await expect(labelPassword).toBeVisible();
      await labelPassword.fill("reactrouter");

      const loginButton = page.getByRole("button", { name: "login" });
      await loginButton.click();

      const mainBlogTitle = page.getByText("Blogs");
      await expect(mainBlogTitle).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      const createNewBlogButton = page.getByRole("button", {
        name: "create new blog",
      });
      await createNewBlogButton.click();

      const labelTitle = page.getByLabel("title:");
      await expect(labelTitle).toBeVisible();
      await labelTitle.fill("Testing with playwright");

      const labelAuthor = page.getByLabel("author:");
      await expect(labelAuthor).toBeVisible();
      await labelAuthor.fill("Cristian junior fullstack web developer");

      const labelUrl = page.getByLabel("url:");
      await expect(labelUrl).toBeVisible();
      await labelUrl.fill("fullstackWebDeveloper.com");

      const createButton = page.getByRole("button", {
        name: "Create",
      });
      await createButton.click();

      await expect(
        page.getByText(
          "Testing with playwright by Cristian junior fullstack web developer",
        ),
      ).toBeVisible();
    });
  });
});
