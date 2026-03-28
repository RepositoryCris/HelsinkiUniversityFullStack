import Blog from "./Blog";
import CreateNew from "./CreateNew";
import Togglable from "./Togglable";

const Blogs = ({ blogs, user, handleLogout, createBlog, blogFormRef }) => {
  /*const filterByUser = blogs.filter((blog) => {
    if (blog.user && blog.user.username === user.username) {
      return blog;
    }
  });*/

  return (
    <>
      <h2>Blogs</h2>
      <p>{`${user.username.toUpperCase()} logged in`}</p>
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateNew createBlog={createBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default Blogs;
