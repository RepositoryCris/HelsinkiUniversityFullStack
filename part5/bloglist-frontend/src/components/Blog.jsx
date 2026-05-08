import { useParams } from "react-router-dom";

const Blog = ({ blogs, handleLike, handleDelete, user }) => {
  const { id } = useParams();
  // 1. Guard clause: Wait for the blogs array to exist
  if (!blogs || blogs.length === 0) return null;

  // 2. Find the specific blog
  const blog = blogs.find((b) => b.id === id);

  // 3. Guard clause: If the ID in the URL doesn't match any blog
  if (!blog) {
    return <p>Blog not found</p>;
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  // Only show the button if the blog was created by the current user
  const showRemoveButton =
    blog.user && user && blog.user.username === user.username;

  const removeButtonStyle = {
    backgroundColor: "dodgerblue",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "5px",
  };

  return (
    <div style={blogStyle} className="blog">
      <h2>
        {blog.author}: {blog.title}
      </h2>

      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div>
        likes {blog.likes}
        {/* REQUIREMENT: Only show Like button if user is logged in */}
        {user && <button onClick={() => handleLike(blog)}>like</button>}
      </div>
      <p>Added by {blog.user?.name || blog.author}</p>

      {showRemoveButton && (
        <button style={removeButtonStyle} onClick={() => handleDelete(blog)}>
          remove
        </button>
      )}
    </div>
  );
};

export default Blog;
