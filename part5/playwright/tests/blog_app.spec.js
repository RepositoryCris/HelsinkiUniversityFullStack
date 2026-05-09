const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  const uniqueId = Date.now();

  beforeEach(async ({ page, request }) => {
    await request
      .post("/api/users", {
        data: {
          username: "crisdev",
          name: "Cristian",
          password: "reactrouter",
        },
      })
      .catch(() => {});
    await page.goto("/");
  });

  test("Login succeeds with correct credentials", async ({ page }) => {
    await loginWith(page, "crisdev", "reactrouter");
    await page.waitForURL("/");
  });

  test("Login fails with wrong credentials", async ({ page }) => {
    await loginWith(page, "crisdev", "wrongpassword");
    await expect(page.getByText(/wrong username or password/i)).toBeVisible();
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "crisdev", "reactrouter");
      await page.waitForURL("/");
    });

    test("A new blog can be created", async ({ page }) => {
      const title = `Blog ${uniqueId}`;
      await createBlog(page, title, "Cristian", "http://test.com");

      await expect(
        page.locator(".notification").getByText(title.toUpperCase()),
      ).toBeVisible();

      const blogLink = page.getByRole("link", { name: new RegExp(title, "i") });
      await expect(blogLink).toBeVisible();
    });

    test("A logged-in user can like blogs", async ({ page }) => {
      const title = `Like Test ${uniqueId}`;
      await createBlog(page, title, "Tester", "http://test.com");

      // Navigate to the individual blog page
      await page.getByRole("link", { name: new RegExp(title, "i") }).click();

      // 1. Capture the initial state (should be 0)
      await expect(page.getByText(/likes:? 0/i)).toBeVisible();

      // 2. Click the button - matching 'like' text exactly
      const likeButton = page.getByRole("button", { name: "like" });
      await likeButton.click();

      // 3. Instead of waiting for a notification, wait for the number to update.
      // This is more robust for Exercise 5.28 logic.
      await expect(page.getByText(/likes:? 1/i)).toBeVisible();
    });

    test("A blog can be deleted", async ({ page }) => {
      const title = `Delete Test ${uniqueId}`;
      await createBlog(page, title, "Author", "http://test.com");

      await page.getByRole("link", { name: new RegExp(title, "i") }).click();

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: /remove|delete/i }).click();

      await page.waitForURL("/");

      const blogLink = page.getByRole("link", { name: new RegExp(title, "i") });
      await expect(blogLink).not.toBeVisible();
    });
  });
});
