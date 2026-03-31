import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

// screen.debug(); method debug that can be used to print the HTML of a component to the terminal

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
});
