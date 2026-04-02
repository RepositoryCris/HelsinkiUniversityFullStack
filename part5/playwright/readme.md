# Initializing tests

Install Playwright by running in the new project directory the command:

```bash
npm init playwright@latest
```

The console:

```bash
PS D:\HelsinkiUniversityFullStack\part5\playwright> npm init playwright@latest
Need to install the following packages:
  create-playwright@1.17.139
Ok to proceed? (y) y
Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
√ Do you want to use TypeScript or JavaScript? · JavaScript
√ Where to put your end-to-end tests? · tests
√ Add a GitHub Actions workflow? (Y/n) · false
√ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
Initializing NPM project (npm init -y)…
Wrote to D:\HelsinkiUniversityFullStack\part5\playwright\package.json:

{
  "name": "playwright",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


Installing Playwright Test (npm install --save-dev @playwright/test)…

added 3 packages, and audited 4 packages in 8s

found 0 vulnerabilities
Installing Types (npm install --save-dev @types/node)…

added 2 packages, and audited 6 packages in 3s

found 0 vulnerabilities
Writing playwright.config.js.
Writing tests\example.spec.js.
Writing package.json.
Downloading browsers (npx playwright install)…
Downloading Chrome for Testing 147.0.7727.15 (playwright chromium v1217) from https://cdn.playwright.dev/builds/cft/147.0.7727.15/win64/chrome-win64.zip
179.4 MiB [====================] 100% 0.0s
Chrome for Testing 147.0.7727.15 (playwright chromium v1217) downloaded to C:\Users\Cristian\AppData\Local\ms-playwright\chromium-1217
Downloading Chrome Headless Shell 147.0.7727.15 (playwright chromium-headless-shell v1217) from
https://cdn.playwright.dev/builds/cft/147.0.7727.15/win64/chrome-headless-shell-win64.zip
111.5 MiB [====================] 100% 0.0s
Chrome Headless Shell 147.0.7727.15 (playwright chromium-headless-shell v1217) downloaded to C:\Users\Cristian\AppData\Local\ms-playwright\chromium_headless_shell-1217
Downloading Firefox 148.0.2 (playwright firefox v1511) from https://cdn.playwright.dev/dbazure/download/playwright/builds/firefox/1511/firefox-win64.zip
113.1 MiB [====================] 100% 0.0s
Firefox 148.0.2 (playwright firefox v1511) downloaded to C:\Users\Cristian\AppData\Local\ms-playwright\firefox-1511
Downloading WebKit 26.4 (playwright webkit v2272) from https://cdn.playwright.dev/dbazure/download/playwright/builds/webkit/2272/webkit-win64.zip
57.6 MiB [====================] 100% 0.0s
WebKit 26.4 (playwright webkit v2272) downloaded to C:\Users\Cristian\AppData\Local\ms-playwright\webkit-2272
Downloading FFmpeg (playwright ffmpeg v1011) from https://cdn.playwright.dev/dbazure/download/playwright/builds/ffmpeg/1011/ffmpeg-win64.zip
1.3 MiB [====================] 100% 0.0s
FFmpeg (playwright ffmpeg v1011) downloaded to C:\Users\Cristian\AppData\Local\ms-playwright\ffmpeg-1011
Downloading Winldd (playwright winldd v1007) from https://cdn.playwright.dev/dbazure/download/playwright/builds/winldd/1007/winldd-win64.zip
0.1 MiB [====================] 100% 0.0s
Winldd (playwright winldd v1007) downloaded to C:\Users\Cristian\AppData\Local\ms-playwright\winldd-1007
✔ Success! Created a Playwright Test project at D:\HelsinkiUniversityFullStack\part5\playwright

Inside that directory, you can run several commands:

  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    npx playwright test

And check out the following files:
  - .\tests\example.spec.js - Example end-to-end test
  - .\playwright.config.js - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨

Happy hacking! 🎭
```

Let's define an `npm script` for running tests and test reports in `package.json`:

```bash
 // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
```

Let's run the tests:

```bash
npm test
```

Console shows:

```bash
PS D:\HelsinkiUniversityFullStack\part5\playwright> npm test

> playwright@1.0.0 test
> playwright test


Running 6 tests using 2 workers
  6 passed (46.3s)

To open last HTML report run:

  npx playwright show-report
```

The tests pass.

A more detailed test report can be opened either with the command suggested by the output, or with the npm script we just defined:

```bash
npm run test:report
```

Tests can also be run via the graphical UI with the command:

```bash
npm run test -- --ui
```

Sample tests in the file tests/example.spec.js look like this:

```js
// @ts-check
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});
```

The first line of the test functions says that the tests are testing the page at `https://playwright.dev/`.

## Testing our own code

Let's make an npm script for the BACKEND, which will enable it to be started in testing mode, i.e. so that `NODE_ENV` gets the value test.

```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env NODE_ENV=test node --test",
    "lint": "eslint .",
    // ...
    "start:test": "cross-env NODE_ENV=test node --watch index.js" //THIS LINE
  },
  // ...
}
```

- Let's **start the `frontend` and `backend`**.

And create the first test file for the application `tests/blog_app.spec.js`

```js
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
```

You can define the browser engine to be used with the command line parameter:

```bash
npm test -- --project chromium
```

When developing tests, it may be wiser to reduce the waiting time to a few seconds. According to the `documentation`, this can be done by changing the file `playwright.config.js` as follows:

```js
export default defineConfig({
  // ...
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  // ...
});
```

## Writing on the form

When developing tests, you could use Playwright's UI mode, i.e. the user interface version. Let's start the tests in UI mode as follows:

```bash
npm test -- --ui
```

First attempt using the method page.getByRole:

```js
describe("Blog app", () => {
  // ...

  test("user can log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "login" }).click();
    await page.getByRole("textbox").fill("mluukkai");
  });
});
```

If it results to an error:

The problem now is that getByRole finds two text fields, and calling the fill method fails, because it assumes that there is only one text field found. One way around the problem is to use the methods `first` and `last`:

```js
await page.getByRole("textbox").first().fill("mluukkai");
await page.getByRole("textbox").last().fill("salainen");
await page.getByRole("button", { name: "login" }).click();

await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
```

After writing in the text fields, the test presses the login button and checks that the application renders the logged-in user's information on the screen.

If there were more than two text fields, using the methods `first` and `last` would not be enough.

One possibility would be to use the `all` method, which turns the found locators into an array that can be indexed:

```js
const textboxes = await page.getByRole("textbox").all();
await textboxes[0].fill("mluukkai");
await textboxes[1].fill("salainen");
```

Both this and the previous version of the test work. However, both are problematic to the extent that if the registration form is changed, the tests may break, as they rely on the fields to be on the page in a certain order.

If an element is difficult to locate in tests, you can assign it a separate `test-id` attribute and find the element in tests using the `getByTestId` method.

Let's now take advantage of the existing elements of the login form. The input fields of the login form have been assigned unique labels:

```js
// ...
<form onSubmit={handleSubmit}>
  <div>
    <label>
      username
      <input type="text" value={username} onChange={handleUsernameChange} />
    </label>
  </div>
  <div>
    <label>
      password
      <input type="password" value={password} onChange={handlePasswordChange} />
    </label>
  </div>
  <button type="submit">login</button>
</form>
// ...
```

Input fields can and should be located in tests using labels with the getByLabel method:

```js
await page.getByLabel("username").fill("mluukkai");
await page.getByLabel("password").fill("salainen");
```

**_When locating elements, it makes sense to aim to utilize the content visible to the user in the interface, as this best simulates how a user would actually find the desired input field while navigating the application._**

**Note:** that passing the test at this stage requires that there is a user in the test database of the backend with username mluukkai and password salainen. Create a user if needed!

## Controlling the state of the database

As with unit and integration tests, with E2E tests it is best to empty the database and possibly format it before the tests are run.

The challenge with E2E tests is that they do not have access to the database.

The solution is to create **API endpoints for the backend tests**. We can empty the database using these endpoints. Let's create a new router for the tests inside the `controllers` folder, in the `testing.js` file

```js
const routerTest = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

routerTest.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = routerTest;
```

And add it to the backend only _if the application is run in test-mode_:

```js
// ...

// Apply userExtractor only to the blogs route
app.use("/api/blogs", middleware.userExtractor, blogsRouter);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);

//ADD THIS CONDITION
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```

After the changes, an HTTP POST request to the `*/api/testing/reset*` endpoint empties the database. Make sure your backend is running in test mode by starting it with this command (previously configured in the `package.json` file):

Run the backend with the command:

```bash
npm run start:test

//CONSOLE.LOG
PS D:\HelsinkiUniversityFullStack\part4\E4.1BlogList> npm run start:test

> e4.1bloglist@1.0.0 start:test
> cross-env NODE_ENV=test node --watch index.js

[dotenv@17.3.1] injecting env (4) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
```

Next, we will change the beforeEach block so that it empties the server's database before tests are run

- **Fix the request Parameter**: In your beforeEach block, you are trying to use request.post(...), but you didn't include request in the argument list. You must destructure it alongside page.

It is important to destructure `request` to use it in the beforeEach block

```js
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
    //...
  });
});
```

During initialization, the test makes HTTP requests to the backend with the method post of the parameter request.

Unlike before, now the testing of the backend always starts from the same state, i.e. there is one user and no blogs in the database.

## Test for failed login

Now let's do a test that ensures that the login attempt fails if the password is wrong.

```js
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
    await expect(page.locator(".error")).toHaveText(
      /Wrong username or password/i,
    );
  });
  // ...
});
```

The test verifies with the method page.getByText that the application prints an error message.

```js
await expect(page.getByText("Wrong username or password")).toBeVisible();
```

The application renders the error message to an element containing the CSS class error:

```js
//Notification (components)
return (
  <div
    style={style}
    className={`notification ${notification.type} notification-error`}
  >
    <span style={{ marginRight: "10px" }}>{activeTheme.icon}</span>
    {notification.message}
  </div>
);
```

We could refine the test to ensure that the error message is printed exactly in the right place, i.e. in the element containing the CSS class error:

```js
const errorNotification = page.locator(".notification-error");
await expect(errorNotification).toContainText("Wrong username or password");
```

So the test uses the `page.locator` method to find the component containing the CSS class `notification-error` and stores it in a variable.
The correctness of the text associated with the component can be verified with the expectation `toContainText`. Note that the `CSS class selector` starts with a **dot**, so the error class selector is **`.notification-error`**

## Test CSS styles

It is possible to test the application's CSS styles with matcher `toHaveCSS`.

We can, for example, make sure that the color of the error message is red, and that there is a border around it:

```js
const errorNotification = page.locator(".notification-error");
await expect(errorNotification).toContainText("Wrong username or password");

await expect(errorNotification).toHaveCSS("color", "rgb(183, 28, 28)"); //"#b71c1c"
await expect(errorNotification).toHaveCSS("border-style", "solid");
```

**Colors must be defined to Playwright as `rgb` codes.**

Ensure that the application does not render the text describing a successful login:

```js
await expect(page.getByText("CRISDEV logged in")).not.toBeVisible();
```

## Testing blog creation

Create a test that adds a new blog to the application:

```js
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
```

## Running tests one by one

By default, Playwright always runs all tests, and as the number of tests increases, it becomes time-consuming. When developing a new test or debugging a broken one, the test can be defined instead than with the command `test`, with the command `test.only`, in which case Playwright will run only that test:

```js
describe(() => {
  // this is the only test executed!
  test.only("login fails with wrong password", async ({ page }) => {
    // ...
  });

  // this test is skipped...
  test("user can login with correct credentials", async ({ page }) => {
    // ...
  });

  // ...
});
```

When the test is ready, `only` can and \*_should be deleted_.

Another option to run a single test is to use a command line parameter:

```bash
npm test -- -g "succeeds with correct credentials"
```

or just to run in chrome

```bash
npm test -- -g "succeeds with correct credentials" --project chromium
```
