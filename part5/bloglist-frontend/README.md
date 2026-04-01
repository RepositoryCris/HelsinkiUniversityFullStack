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

### Testing the forms

for just one role

```js
input = screen.getByRole("textbox");
```

for more than one role

```js
inputs = screen.getAllByRole("textbox");
```

Example of more than one role

```js
test("calls onSubmit (in the form) with correct data using getAllByRole for input selection", async () => {
  const user = userEvent.setup();

  const inputs = screen.getAllByRole("textbox"); //screen.getByRole('textbox') for just one role
  const createButton = screen.getByText("Create");

  screen.debug(inputs);

  await user.type(inputs[0], "Learning vitest");
  await user.type(inputs[1], "Cristian M. A. junior developer");
  await user.type(inputs[2], "http://test.com");
  await user.click(createButton);

  expect(mockHandlerCreateBlog.mock.calls).toHaveLength(1);

  // Check the first argument of the first call
  const callArgument = mockHandlerCreateBlog.mock.calls[0][0];

  expect(callArgument.title).toBe("Learning vitest");
  expect(callArgument.author).toBe("Cristian M. A. junior developer");
  expect(callArgument.url).toBe("http://test.com");
});
```

### About finding the elements

If a label were defined for the input field, the input field could be located using it with the `getByLabelText` method. For example, if we added a label to the input field:

```js
// ...
<label>
  content
  <input value={newBlog} onChange={(event) => setNewBlog(event.target.value)} />
</label>
// ...
```

The test could locate the input field as follows:

```js
const input = screen.getByLabelText("content");
```

Quite often input fields have a placeholder text that hints user what kind of input is expected. Let us add a placeholder to our form:

```js
placeholder = "write note content here";
```

Now finding the right input field is easy with the method `getByPlaceholderText`:

```js
const input = screen.getByPlaceholderText("write note content here");
```

Sometimes, finding the correct element using the methods described above can be challenging. In such cases, an alternative is the method `querySelector` of the container object, which is returned by render, as was mentioned earlier in this part. Any CSS selector can be used with this method for searching elements in tests.

Consider eg. that we would define a unique id to the input field:

```js
<input
  value={newNote}
  onChange={(event) => setNewNote(event.target.value)}
  id="note-input"
/>
```

The input element could now be found in the test as follows:

```js
const { container } = render(<NoteForm createNote={createNote} />);

const input = container.querySelector("#note-input");
```

However, we shall stick to the approach of using `getByPlaceholderText` in the test.

### Test coverage

We can easily find out the coverage of our tests by running them with the command.

```bash
npm test -- --coverage
```

The first time you run the command, Vitest will ask you if you want to install the required library `@vitest/coverage-v8`. Install it, and run the command again:

```bash
PS D:\HelsinkiUniversityFullStack\part5\bloglist-frontend> npm test -- --coverage

> bloglist-frontend@0.0.0 test
> vitest run

 MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'

√ Do you want to install @vitest/coverage-v8? ... yes

added 11 packages, changed 4 packages, and audited 371 packages in 22s

133 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Package @vitest/coverage-v8@4.1.2 installed, re-run the command to start.
```

Running again the comand npm test -- --coverage

```bash
PS D:\HelsinkiUniversityFullStack\part5\bloglist-frontend> npm test -- --coverage

> bloglist-frontend@0.0.0 test
> vitest run


 RUN  v4.1.2 D:/HelsinkiUniversityFullStack/part5/bloglist-frontend
      Coverage enabled with v8

 ✓ src/components/Blog.test.jsx (9 tests) 4501ms
   ✓ <Blog /> (7)
     ✓ Renders content 163ms
     ✓ Renders content using CSS selector 19ms
     ✓ Does not render content 16ms
     ✓ clicking the button view permit to show the url, likes and name  497ms
     ✓ clicking the button view permit to show content then click hide button to hide content 253ms
     ✓ clicking the like button twice calls the event handler twice 247ms
     ✓ clicking the remove button calls the handler once 174ms
   ✓ <CreateNew /> (2)
     ✓ NewBlogForm: should call createBlog with correct data using index-based role selectors  1458ms
     ✓ NewBlogForm: should call createBlog with correct data using accessible label mapping  1663ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  19:13:41
   Duration  9.34s (transform 213ms, setup 608ms, import 434ms, tests 4.50s, environment 2.68s)

 % Coverage report from v8
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |   96.15 |      100 |     100 |   96.15 |
 Blog.jsx      |     100 |      100 |     100 |     100 |
 CreateNew.jsx |   93.75 |      100 |     100 |   93.75 | 22
---------------|---------|----------|---------|---------|-------------------
```

Understanding the Coverage Table

## Coverage Report Summary

| Metric             | Description                                               | Result            |
| ------------------ | --------------------------------------------------------- | ----------------- |
| **% Stmts**        | Percentage of total code statements executed.             | 96.15%            |
| **% Branch**       | Did you test both sides of if/else or ternary statements? | 100% (Excellent!) |
| **% Funcs**        | Were all functions in the file called at least once?      | 100%              |
| **Uncovered Line** | The specific line number that the tests missed.           | Line 22           |

A HTML report will be generated to the coverage directory. The report will tell us the lines of untested code in each component:

How to see the "Why"

As a Systems Engineer, you'll appreciate the HTML Report. Vitest generates a visual guide that highlights the exact line in red.

1. Look in your project folder for a folder named /coverage.

2. Open /coverage/lcov-report/index.html (or similar) in your browser.

3. Click on CreateNew.jsx.

Should you worry about it?

- The Professional QA Answer: Ideally, you want 100%. If Line 22 is an error message, you should write a test where you submit an empty form to see if that error shows up.

- The Pragmatic Developer Answer: 93%–96% is actually a very high score! If Line 22 is just a minor cleanup line or a "fallback" that is hard to trigger, it’s often okay to leave it.

To have the 100% just create the corresponding tests that covers the observations, then you will have this result.

```bash
PS D:\HelsinkiUniversityFullStack\part5\bloglist-frontend> npm test -- --coverage

> bloglist-frontend@0.0.0 test
> vitest run


 RUN  v4.1.2 D:/HelsinkiUniversityFullStack/part5/bloglist-frontend
      Coverage enabled with v8

 ✓ src/components/Blog.test.jsx (11 tests) 5758ms
   ✓ <Blog /> (7)
     ✓ Renders content 211ms
     ✓ Renders content using CSS selector 23ms
     ✓ Does not render content 17ms
     ✓ clicking the button view permit to show the url, likes and name  689ms
     ✓ clicking the button view permit to show content then click hide button to hide content  330ms
     ✓ clicking the like button twice calls the event handler twice 234ms
     ✓ clicking the remove button calls the handler once 235ms
   ✓ <CreateNew /> (4)
     ✓ NewBlogForm: should call createBlog with correct data using index-based role selectors  1533ms
     ✓ NewBlogForm: should call createBlog with correct data using accessible label mapping  1356ms6ms
     ✓ NewBlogForm: should NOT call createBlog if any field is empty 285ms
     ✓ NewBlogForm: should log an error to the console if createBlog fails  835ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  19:37:26
   Duration  10.68s (transform 227ms, setup 629ms, import 413ms, tests 5.76s, environment 2.95s)

 % Coverage report from v8
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |
 Blog.jsx      |     100 |      100 |     100 |     100 |
 CreateNew.jsx |     100 |      100 |     100 |     100 |
---------------|---------|----------|---------|---------|-------------------
```

Let's add the directory `coverage/` to the .gitignore file to exclude its contents from version control:

```bash
//...
### add in .gitignore file
coverage
```

## Key Points: Frontend Integration & Snapshot Testing

### Integration Tests

- **Test collaboration** between multiple components working together
- **More difficult** than unit tests due to needing to mock server data
- The course chose **end-to-end (E2E) tests** instead (covered in final chapter)

### Snapshot Testing (Vitest)

**What it is:**

- Compares component's **HTML output before and after changes**

**How it works:**

1. Takes a "snapshot" of the component's HTML
2. When code changes, compares new HTML to saved snapshot
3. Notifies developer of **any differences**

**Developer's role:**

- Review the change
- Tell Vitest if the change was **intended** (update snapshot) or **unintended** (bug found)

**Advantages:**

- **No need to write test logic** manually
- Easy to adopt
- Catches **unexpected UI changes** automatically

**Key distinction:**

> Snapshot testing notifies developers of HTML changes. If unexpected → likely a bug.

---

### Frontend integration tests

- Test multiple components together

- Harder than unit tests (need to mock server data)

- Course uses E2E tests instead

| Test Type             | What It Tests                        | Complexity    |
| --------------------- | ------------------------------------ | ------------- |
| **Unit Tests**        | Individual components in isolation   | Lower         |
| **Integration Tests** | Multiple components working together | Higher        |
| **E2E Tests**         | Whole application flow               | Highest       |
| **Snapshot Tests**    | HTML changes between versions        | Minimal setup |

#### Snapshot Testing

- Compares component HTML before/after changes

- Alerts developer of differences

- Developer decides: intended (update) or bug (fix)

- Benefits: No test logic needed, easy to use, catches unexpected UI changes

### Libraries for testing

| Library / Tool            | Role                    | Function                                                                             | Key UtilityUsed                                            |
| ------------------------- | ----------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Vitest**                | **Test Runner**         | The "engine" that executes tests, provides the CLI, and handles mocking.             | `vi.fn()`, `describe`, `test`                              |
| **React Testing Library** | **Query Utility**       | Provides a way to render components and find elements from a user's perspective.     | `render`, `screen`, `getByText`                            |
| **User Event**            | **Interaction Utility** | Simulates realistic browser interactions (clicks, typing) better than simple events. | `userEvent.setup()`, `await user.click()`                  |
| **Jest-DOM**              | **Custom Matchers**     | Extends Vitest/Jest `expect` with "human-readable" DOM assertions.                   | `.toBeVisible()`, `.toBeDefined()`, `.toHaveTextContent()` |
| **JSDOM**                 | **Environment**         | A "headless" browser simulation that allows React to run in Node.js.                 | (The virtual `document` and `window`)                      |
