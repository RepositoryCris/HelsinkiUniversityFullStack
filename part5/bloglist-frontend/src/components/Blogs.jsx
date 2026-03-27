import Blog from "./Blog";

const Blogs = ({ blogs, user, handleLogout }) => {
  /*const filterByUser = blogs.filter((blog) => {
    if (blog.user && blog.user.username === user.username) {
      return blog;
    }
  });*/

  return (
    <>
      <h2>blogs</h2>
      <p>{`${user.username.toUpperCase()} logged in`}</p>
      <button onClick={handleLogout}>logout</button>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default Blogs;
