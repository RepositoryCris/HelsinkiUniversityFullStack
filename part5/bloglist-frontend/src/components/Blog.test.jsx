import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import CreateNew from "./CreateNew";
// screen.debug(); method debug that can be used to print the HTML of a component to the terminal
// screen.debug(element);
// mockHandler.mockClear(); you can put this in the beforeEach
const id = "69c5ee76cbb024ab24fdfdd9";
const mockHandlerLike = vi.fn();
const mockHandlerDelete = vi.fn();

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
        handleLike={mockHandlerLike}
        handleDelete={mockHandlerDelete}
      />,
    ).container;
  });

  test("Renders content", () => {
    const title = screen.getByText("Practicing react ", { exact: false });
    expect(title).toBeDefined();

    const author = screen.getByText("Cristian", { exact: false });
    expect(author).toBeDefined();
  });

  test("Renders content using CSS selector", () => {
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("Practicing react ");

    const div2 = container.querySelector(".blog");
    expect(div2).toHaveTextContent("Cristian");
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

  test("clicking the button view permit to show the url, likes and name", async () => {
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

  test("clicking the like button twice calls the event handler twice", async () => {
    const user = userEvent.setup();

    // Reveal the hidden part of the blog
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    // Find the like button
    const likeButton = screen.getByText("like");

    // Click it twice
    await user.click(likeButton);
    await user.click(likeButton);

    // Requirement: Check that the handler was called exactly twice
    expect(mockHandlerLike.mock.calls).toHaveLength(2);

    // Note: We remove the "likes 7" check because the mock handler
    // does not actually update the component's props in this test environment.
  });

  test("clicking the remove button calls the handler once", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("view"));

    const removeButton = screen.getByText("remove");
    await user.click(removeButton);

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
