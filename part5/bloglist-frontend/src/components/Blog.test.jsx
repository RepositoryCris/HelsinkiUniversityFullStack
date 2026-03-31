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
