import Blog from "./Blog";
import CreateNew from "./CreateNew";
import Togglable from "./Togglable";

const Blogs = ({
  blogs,
  user,
  handleLogout,
  createBlog,
  blogFormRef,
  handleLike,
  handleDelete,
}) => {
  /*const filterByUser = blogs.filter((blog) => {
    if (blog.user && blog.user.username === user.username) {
      return blog;
    }
  });*/

  // In your component's return statement:
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <h2>Blogs</h2>
      <p>{`${user.username.toUpperCase()} logged in`}</p>
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateNew createBlog={createBlog} />
      </Togglable>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          user={user}
          handleDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default Blogs;
