// tests/helper.js
const loginWith = async (page, username, password) => {
  await page.goto("/login");
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
  // Do NOT use waitForURL here; handle it in the specific test
};

const createBlog = async (page, title, author, url) => {
  // Click the 'new blog' link from the nav bar instead of page.goto
  await page.getByRole("link", { name: /new blog/i }).click();

  // Wait specifically for your CreateNew component's heading
  await page.getByRole("heading", { name: /create new/i }).waitFor();

  await page.locator('input[name="title"]').fill(title);
  await page.locator('input[name="author"]').fill(author);
  await page.locator('input[name="url"]').fill(url);

  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForURL("/");
};

module.exports = { loginWith, createBlog };
