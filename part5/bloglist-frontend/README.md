# Part 5

## 5.1 Blog List Frontend step 1

Clone the application from GitHub with the command:

```bash
`git clone https://github.com/fullstack-hy2020/bloglist-frontendcopy`
```

Remove the git configuration of the cloned application

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```

The application is started the usual way, but you have to install its dependencies first:

```bash
npm install
npm run dev
```

### Configure a Vite Proxy

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
});
```

## 5.2 Blog List Frontend Step 2

### Local Storage for Login Persistence

Problem: User logs out when browser refreshes.

Solution: Save user data to local storage.

Methods:

- `localStorage.setItem('key', value)` - store string

- `localStorage.getItem('key')` - retrieve

- `localStorage.removeItem('key')` - delete

Implementation:

```javascript
// Login - save user
const userJSON = JSON.stringify(user);
localStorage.setItem("loggedUser", userJSON);

// App load - restore user
const savedUser = JSON.parse(localStorage.getItem("loggedUser"));

// Logout - clear
localStorage.removeItem("loggedUser");
```

Storage only accepts strings, so use `JSON.stringify()` and `JSON.parse()`

### Update handleLogin to Save the Session

In your `handleLogin` function, once the server returns a successful user object, you need to stringify it and store it in `localStorage`.

```js
const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const user = await loginService.login({ username, password });

    // --- ADDED FOR 5.2 ---
    window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
    // ---------------------

    blogService.setToken(user.token);
    setUser(user);
    setUsername("");
    setPassword("");
  } catch {
    setErrorMessage("wrong credentials");
    setTimeout(() => setErrorMessage(null), 5000);
  }
};
```

### Add a useEffect to Load the Session on Startup

You need a "hook" that runs exactly once when the application starts up. It checks if that specific key exists in `localStorage`.

```JavaScript
useEffect(() => {
const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
if (loggedUserJSON) {
const user = JSON.parse(loggedUserJSON);
setUser(user);
blogService.setToken(user.token);
}
}, []);
```

**Note:** Make sure to call `blogService.setToken(user.token)` inside this effect, otherwise, your subsequent requests to create or delete blogs will fail because the service won't have the token!

### Implement the Logout Functionality

To "log out," you simply need to clear the state and remove the item from the browser's storage.

In `App.jsx`:

```JavaScript
const handleLogout = () => {
window.localStorage.removeItem('loggedBlogappUser');
setUser(null);
};
```

## Testing React apps

Start by installing `Vitest` and the `jsdom` library simulating a web browser:

```bash
npm install --save-dev vitest jsdom
```

- library that will help us render components for testing purposes `react-testing-library`

- It is also worth extending the expressive power of the tests with the library `jest-dom`.

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### configurations for vitest

Add a script to the `package.json` file to run the tests:

```json
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

Let's create a file `testSetup.js` in the project root with the following content

```js
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});
```

Now, after each test, the function cleanup is executed to reset jsdom, which is simulating the browser.

Expand the vite.config.js file as follows

```js
export default defineConfig({
  // ...
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./testSetup.js",
  },
});
```

With `globals: true`, there is no need to import keywords such as `describe`, `test` and `expect` into the tests.

Run the test with command npm test:

```bash
npm test
```

`Eslint` complains about the keywords test and expect in the tests. The problem can be solved by adding the following configuration to the eslint.config.js file:

```js
// ...

export default [
  // ...
  {
    files: ["**/*.test.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
];
```

This is how ESLint is informed that Vitest keywords are globally available in test files.

Unit tests examples:

```js
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  const blog = {
    title: "Practicing react ",
    author: "Cristian",
    url: "https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4",
    likes: 0,
    user: {
      username: "root",
      name: "Superuser",
      id: "69c3278153f22852f28b7859",
    },
    id: "69c5ee76cbb024ab24fdfdd9",
  };
  const user = { username: "root" };

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} />).container;
  });

  test("renders content", () => {
    const title = screen.getByText("Practicing react ", { exact: false });
    expect(title).toBeDefined();

    const author = screen.getByText("Cristian", { exact: false });
    expect(author).toBeDefined();
  });

  test("Does not render content", () => {
    const url = screen.queryByText(
      "https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4",
      { exact: false },
    );
    expect(url).toBeNull();

    const likes = screen.queryByText(0, { exact: false });
    expect(likes).toBeNull();
  });
});
```

### Debugging tests

We typically run into many different kinds of problems when writing our tests.

Object screen has method debug that can be used to print the HTML of a component to the terminal. If we change the test as follows:

```js
screen.debug();
```

It is also possible to use the same method to print a wanted `element` to console:

```js
//...
const element = screen.getByText(
  "Component testing is done with react-testing-library",
);

screen.debug(element);

expect(element).toBeDefined();
//...
```

### Clicking buttons in tests

Let us install a library user-event that makes simulating user input a bit easier:

```bash
npm install --save-dev @testing-library/user-event
```

Testing this functionality can be accomplished like this:

```js
//...
import userEvent from "@testing-library/user-event";
//...

const mockHandler = vi.fn();

render(<Note note={note} toggleImportance={mockHandler} />);

const user = userEvent.setup();
const button = screen.getByText("make not important");
await user.click(button);

expect(mockHandler.mock.calls).toHaveLength(1);
```

There are a few interesting things related to this test. The event handler is a mock function defined with Vitest:

```js
const mockHandler = vi.fn();
```

A session is started to interact with the rendered component:

```js
const user = userEvent.setup();
```

The test finds the button based on the text from the rendered component and clicks the element:

```js
const button = screen.getByText("make not important");
await user.click(button);
```

Clicking happens with the method click of the userEvent-library.

The expectation of the test uses toHaveLength to verify that the mock function has been called exactly once:

```js
expect(mockHandler.mock.calls).toHaveLength(1);
```

The calls to the mock function are saved to the array mock.calls within the mock function object.

Mock objects and functions are commonly used stub components in testing that are used for replacing dependencies of the components being tested. Mocks make it possible to return hardcoded responses, and to verify the number of times the mock functions are called and with what parameters.

```js
//...
const id = "69c5ee76cbb024ab24fdfdd9";
const mockHandler = vi.fn();

describe("<Blog />", () => {
  let container;
  const blog = {
    title: "Practicing react ",
    author: "Cristian",
    url: "https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4",
    likes: 5,
    user: {
      username: "root",
      name: "Superuser",
      id: "69c3278153f22852f28b7859",
    },
    id: "69c5ee76cbb024ab24fdfdd9",
  };
  const user = { username: "root", name: "Superuser" };

  beforeEach(() => {
    container = render(
      <Blog
        key={id}
        blog={blog}
        user={user}
        handleLike={mockHandler}
        handleDelete={mockHandler}
      />,
    ).container;
  });

//...

test("clicking the button view permit to show the url and likes", async () => {
  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const url = screen.getByText(
    "https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4",
  );
  expect(url).toBeVisible();

  const likes = screen.getByText("likes 5");
  expect(likes).toBeVisible();

  const name = screen.getByText("Superuser");
  expect(name).toBeVisible();
});
```

The beforeEach function gets called before each test, which then renders the `Togglable` component.

The remaining tests use the toBeVisible method to verify that the child component of the `Togglable` component is not visible initially, i.e. that the style of the div element contains { display: 'none' }. Another test verifies that when the button is pressed the component is visible, meaning that the style for hiding it is no longer assigned to the component.

```js
test("clicking the button view permit to show content then click hide button to hide content", async () => {
  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const url = screen.getByText(
    "https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4",
  );
  expect(url).toBeVisible();

  const likes = screen.getByText("likes 5");
  expect(likes).toBeVisible();

  const name = screen.getByText("Superuser");
  expect(name).toBeVisible();

  const hideButton = screen.getByText("hide");
  await user.click(hideButton);

  // Use queryByText because the element url, likes and name are removed from the DOM
  const noUrl = screen.queryByText(
    "https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4",
  );
  expect(noUrl).toBeNull();

  const noLikes = screen.queryByText("likes 5");
  expect(noLikes).toBeNull();

  const noName = screen.queryByText("Superuser");
  expect(noName).toBeNull();

  const visibleView = screen.getByText("view");
  expect(visibleView).toBeVisible();
});
```
