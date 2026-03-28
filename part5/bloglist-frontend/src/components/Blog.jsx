import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  // Only show the button if the blog was created by the current user
  const showRemoveButton = blog.user && blog.user.username === user.username

  const removeButtonStyle = {
    backgroundColor: 'dodgerblue',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '5px',
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <p>{blog.user?.name}</p>

          {showRemoveButton && (
            <button
              style={removeButtonStyle}
              onClick={() => handleDelete(blog)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
