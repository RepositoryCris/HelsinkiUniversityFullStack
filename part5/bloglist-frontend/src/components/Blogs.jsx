import Blog from "./Blog";
import CreateNew from "./CreateNew";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";

const Blogs = ({
  blogs,
  user,
  handleLogout,
  createBlog,
  blogFormRef,
  handleLike,
  handleDelete,
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  // In your component's return statement:
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <h2>Blogs</h2>

      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Blogs;
