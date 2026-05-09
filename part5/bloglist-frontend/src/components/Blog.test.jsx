import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import CreateNew from "./CreateNew";

import { MemoryRouter, Routes, Route } from "react-router-dom";

// screen.debug(); method debug that can be used to print the HTML of a component to the terminal
// screen.debug(element);
// mockHandler.mockClear(); you can put this in the beforeEach
const id = "69c5ee76cbb024ab24fdfdd9";
const mockHandlerLike = vi.fn();
const mockHandlerDelete = vi.fn();

describe("<Blog /> - Legacy Functional Tests", () => {
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

  // Helper to maintain consistency
  const renderBlog = (userData = user) => {
    return render(
      <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={[blog]} // Fix: Pass array for guard clause
                user={userData}
                handleLike={mockHandlerLike}
                handleDelete={mockHandlerDelete}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  test("Renders content correctly", () => {
    renderBlog();
    // Use regex to be more flexible with formatting
    expect(screen.getByText(/Cristian/i)).toBeDefined();
    expect(screen.getByText(/Practicing react/i)).toBeDefined();
  });

  test("Shows URL and likes when a user is logged in", () => {
    renderBlog();

    const url = screen.getByText(blog.url);
    const likes = screen.getByText(/likes 5/i);

    expect(url).toBeVisible();
    expect(likes).toBeVisible();
  });

  test("clicking the like button twice calls the event handler twice", async () => {
    const session = userEvent.setup();
    renderBlog();

    const likeButton = screen.getByText("like");
    await session.click(likeButton);
    await session.click(likeButton);

    expect(mockHandlerLike).toHaveBeenCalledTimes(2);
  });

  test("clicking the remove button calls the handler once", async () => {
    const session = userEvent.setup();
    renderBlog();

    const removeButton = screen.getByText("remove");
    await session.click(removeButton);

    expect(mockHandlerDelete).toHaveBeenCalledTimes(1);
  });
});

describe("<CreateNew />", () => {
  let container;

  const mockHandlerCreateBlog = vi.fn();

  beforeEach(() => {
    mockHandlerCreateBlog.mockClear();

    container = render(
      <CreateNew createBlog={mockHandlerCreateBlog} />,
    ).container;
  });

  test("NewBlogForm: should call createBlog with correct data using index-based role selectors", async () => {
    const user = userEvent.setup();

    const inputs = screen.getAllByRole("textbox"); //screen.getByRole('textbox') for just one role
    const createButton = screen.getByText("Create");

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

  test("NewBlogForm: should call createBlog with correct data using accessible label mapping", async () => {
    const user = userEvent.setup();

    const inputTitle = screen.getByLabelText("title:");
    const inputAuthor = screen.getByLabelText("author:");
    const inputUrl = screen.getByLabelText("url:");

    const createButton = screen.getByText("Create");

    await user.type(inputTitle, "Learning vitest");
    await user.type(inputAuthor, "Cristian M. A. junior developer");
    await user.type(inputUrl, "http://test.com");
    await user.click(createButton);

    expect(mockHandlerCreateBlog.mock.calls).toHaveLength(1);

    // Check the first argument of the first call
    const callArgument = mockHandlerCreateBlog.mock.calls[0][0];

    expect(callArgument.title).toBe("Learning vitest");
    expect(callArgument.author).toBe("Cristian M. A. junior developer");
    expect(callArgument.url).toBe("http://test.com");
  });

  test("NewBlogForm: should NOT call createBlog if any field is empty", async () => {
    const user = userEvent.setup();
    const createButton = screen.getByText("Create");

    // We only fill the author, leaving title and url empty
    const authorInput = screen.getByLabelText("author:");
    await user.type(authorInput, "Cristian");

    await user.click(createButton);

    // The guard stops the execution before mockHandlerCreateBlog is ever called
    expect(mockHandlerCreateBlog).not.toHaveBeenCalled();
  });

  // TEST 4: The "Error Path" (Hits the Catch Block for 100% Coverage)
  test("NewBlogForm: should log an error to the console if createBlog fails", async () => {
    const user = userEvent.setup();

    // Force the mock to return a rejected promise
    mockHandlerCreateBlog.mockRejectedValueOnce(new Error("API Failure"));

    // Spy on console.error to verify the catch block runs
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const inputTitle = screen.getByLabelText("title:");
    const createButton = screen.getByText("Create");

    // Fill minimum required data to bypass the frontend guard
    await user.type(inputTitle, "Error Test");
    await user.type(screen.getByLabelText("author:"), "Tester");
    await user.type(screen.getByLabelText("url:"), "http://error.com");

    await user.click(createButton);

    // Verify console.error was triggered by the catch block
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe("<Blog/> - Authorization & Routing (Refactored)", () => {
  // The "State Seed": A blog created by 'helsinki'
  const blog = {
    id: "69c43f11b35555ca35f42a92",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 19,
    user: {
      username: "helsinki",
      name: "helsinki user",
    },
  };

  // Professional QA Approach: Reusable render function with "Login" injection
  const setupEnv = (loggedInUser = null) => {
    const urlPath = `/blogs/${blog.id}`;

    render(
      <MemoryRouter initialEntries={[urlPath]}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={[blog]} // Pass as array to bypass your component's guard clause
                user={loggedInUser} // This simulates the "Login" state
                handleLike={mockHandlerLike}
                handleDelete={mockHandlerDelete}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  test("Requirement 1: Unauthenticated user sees info but NO buttons", () => {
    setupEnv(null); // No one is logged in

    expect(screen.getByText(new RegExp(blog.url, "i"))).toBeVisible();
    expect(screen.getByText(/likes 19/i)).toBeVisible();

    // Guard check: ensure no interaction buttons exist
    expect(screen.queryByText("like")).toBeNull();
    expect(screen.queryByText("remove")).toBeNull();
  });

  test("Requirement 2: Non-creator sees ONLY the like button", () => {
    const intruder = { username: "other_user", name: "Stranger" };
    setupEnv(intruder); // "Login" as someone else

    expect(screen.getByText("like")).toBeVisible();

    // Logic check: They shouldn't be able to delete helsinki's blog
    expect(screen.queryByText("remove")).toBeNull();
  });

  test("Requirement 3: Creator sees BOTH like and delete buttons", () => {
    const creator = { username: "helsinki", name: "helsinki user" };
    setupEnv(creator); // "Login" as the owner

    expect(screen.getByText("like")).toBeVisible();
    expect(screen.getByText("remove")).toBeVisible();
  });
});
