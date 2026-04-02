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
