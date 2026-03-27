import Blog from "./Blog";
import CreateNew from "./CreateNew";

const Blogs = ({ blogs, user, handleLogout, createBlog }) => {
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

      <CreateNew createBlog={createBlog} />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default Blogs;
