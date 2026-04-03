const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

//after you create a blog use .waitFor() to proceed with the next verification

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // 1. Reset the database
    // Ensure your backend has the /api/testing/reset endpoint enabled!
    await request.post("/api/testing/reset");

    // 2. Create a user for the backend
    await request.post("/api/users", {
      data: {
        username: "crisdev",
        name: "cris junior developer",
        password: "reactrouter",
      },
    });

    await page.goto("/");
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
      await loginWith(page, "crisdev", "reactrouterwrongpassword");

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
      await loginWith(page, "crisdev", "reactrouter");

      const mainBlogTitle = page.getByText("Blogs");
      await expect(mainBlogTitle).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "crisdev", "reactrouter");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "Testing with playwright",
        "Cristian junior fullstack web developer",
        "fullstackWebDeveloper.com",
      );
      await expect(
        page.getByText(
          "Testing with playwright by Cristian junior fullstack web developer",
        ),
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      const blogs = [
        {
          title: "Testing with playwright blog # 1",
          author: "Cristian junior web developer # 1",
          url: "juniorWebDeveloper1.com",
        },
        {
          title: "Testing with playwright blog # 2",
          author: "Cristian junior web developer # 2",
          url: "juniorWebDeveloper2.com",
        },
        {
          title: "Testing with playwright blog # 3",
          author: "Cristian junior web developer # 3",
          url: "juniorWebDeveloper3.com",
        },
        {
          title: "Testing with playwright blog # 4",
          author: "Cristian junior web developer # 4",
          url: "juniorWebDeveloper4.com",
        },
        {
          title: "Testing with playwright blog # 5",
          author: "Cristian junior web developer # 5",
          url: "juniorWebDeveloper5.com",
        },
      ];

      // Create all blogs
      for (const blog of blogs) {
        await createBlog(page, blog.title, blog.author, blog.url);
        await page.getByText(`${blog.title} by ${blog.author}`).waitFor();
      }

      const content = `${blogs[4].title} ${blogs[4].author}`;

      // 1. Target the specific blog component using its class and content
      const blogContainer = page.locator(".blog").filter({ hasText: content });

      // 2. Click the view button inside THAT specific blog
      await blogContainer.getByRole("button", { name: "view" }).click();

      await expect(blogContainer.getByText("likes 0")).toBeVisible();

      // 3. Click the like button inside THAT specific blog
      const likeButton = blogContainer.getByRole("button", { name: "like" });
      await likeButton.click();

      // 4. Verify the like increment within that specific container
      // React code renders "likes {blog.likes}"
      await expect(blogContainer.getByText("likes 1")).toBeVisible();
    });

    test("a blog can be deleted by the user who created it", async ({
      page,
    }) => {
      const blogs = [
        {
          title: "Testing with playwright blog # 1",
          author: "Cristian junior web developer # 1",
          url: "juniorWebDeveloper1.com",
        },
        {
          title: "Testing with playwright blog # 2",
          author: "Cristian junior web developer # 2",
          url: "juniorWebDeveloper2.com",
        },
        {
          title: "Testing with playwright blog # 3",
          author: "Cristian junior web developer # 3",
          url: "juniorWebDeveloper3.com",
        },
        {
          title: "Testing with playwright blog # 4",
          author: "Cristian junior web developer # 4",
          url: "juniorWebDeveloper4.com",
        },
        {
          title: "Testing with playwright blog # 5",
          author: "Cristian junior web developer # 5",
          url: "juniorWebDeveloper5.com",
        },
        // 1. Setup: Create a specific blog to delete
        {
          title: "Blog to be deleted",
          author: "Cristian junior developer do not give up",
          url: "delete-me.com",
        },
      ];

      // Create all blogs
      for (const blog of blogs) {
        await createBlog(page, blog.title, blog.author, blog.url);
        await page.getByText(`${blog.title} by ${blog.author}`).waitFor();
      }

      // Define the target blog data clearly
      const targetBlog = blogs[5];
      const content = `${targetBlog.title} ${targetBlog.author}`;

      // 2. Find the specific blog container
      const blogContainer = page.locator(".blog").filter({ hasText: content });

      // 3. Open the blog details to reveal the 'remove' button
      await blogContainer.getByRole("button", { name: "view" }).click();

      // 4. Handle the confirm dialog - Define BEFORE clicking the remove button
      page.on("dialog", async (dialog) => {
        // Verify the message matches your React logic
        // This is a great "System Engineer" move to ensure accuracy
        const expectedMessage = `Remove blog ${targetBlog.title} by ${targetBlog.author}?`;

        if (dialog.message() === expectedMessage) {
          console.log("Confirming deletion for:", dialog.message());
          await dialog.accept(); // Clicks 'OK'
        } else {
          console.log("Unexpected dialog message:", dialog.message());
          await dialog.dismiss(); // Clicks 'Cancel' if it's the wrong dialog
        }
      });

      // 5. Click the remove button
      const removeButton = blogContainer.getByRole("button", {
        name: "remove",
      });
      await removeButton.click();

      // 6. Verify the blog is gone from the UI
      // Use the 'content' variable to ensure consistency with what we looked for earlier
      await expect(page.getByText(content)).not.toBeVisible();
    });

    test("only the user who created a blog can see the delete button", async ({
      page,
      request,
    }) => {
      // Now loginWith will find the labels because the page is loaded and reset
      //await loginWith(page, "crisdev", "reactrouter");

      // Create second user
      await request.post("/api/users", {
        data: {
          username: "otheruser",
          name: "Other User",
          password: "otherpassword",
        },
      });

      const title = "Blog recently created by Cris";
      const author = "Cris";
      const url = "cris.com";
      await createBlog(page, title, author, url);

      // Use the exact text your UI shows
      await page.getByText(`${title} by Cris`).waitFor();

      const blogContainer = page.locator(".blog").filter({ hasText: title });
      await blogContainer.getByRole("button", { name: "view" }).click();

      // Verify owner sees it
      await expect(
        blogContainer.getByRole("button", { name: "remove" }),
      ).toBeVisible();

      // 3. Logout
      await page.getByRole("button", { name: "logout" }).click();

      // 4. Login as other user
      await loginWith(page, "otheruser", "otherpassword");

      // 5. Check visibility
      const otherBlogContainer = page
        .locator(".blog")
        .filter({ hasText: title });
      await otherBlogContainer.getByRole("button", { name: "view" }).click();
      await expect(
        otherBlogContainer.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });
  });
});
