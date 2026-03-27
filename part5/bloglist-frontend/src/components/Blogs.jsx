import Blog from "./Blog";

const Blogs = ({ blogs, user }) => {
  /*const filterByUser = blogs.filter((blog) => {
    if (blog.user && blog.user.username === user.username) {
      return blog;
    }
  });*/

  return (
    <>
      <h2>blogs</h2>
      <p>{`${user.username.toUpperCase()} logged in`}</p>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default Blogs;
