import { useState, useEffect, useRef } from 'react'

import blogService from './services/blog'
import loginService from './services/login'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const apiBlogs = () => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await blogService.getBlogs()
        setBlogs(blogsData)
      } catch (error) {
        setNotification({
          message: error.message,
          type: 'error',
        })
      } finally {
        //
      }
    }

    fetchBlogs()
  }

  useEffect(() => {
    apiBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (notification) {
      const timeoutId = setTimeout(() => {
        setNotification(null)
      }, 5000)

      // The Cleanup Function:
      // This runs if notification changes OR the component unmounts
      return () => clearTimeout(timeoutId)
    }
  }, [notification])

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
  }
  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({
        message: 'Wrong username or password',
        type: 'error',
      })
    } finally {
      ('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogFormRef = useRef()

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      const blogWithFullUser = {
        ...returnedBlog,
        user: {
          id: returnedBlog.user,
          username: user.username,
          name: user.name,
        },
      }
      setBlogs(blogs.concat(blogWithFullUser))
      blogFormRef.current.toggleVisibility()

      setNotification({
        message: `A new blog ${returnedBlog.title.toUpperCase()} by ${returnedBlog.author.toUpperCase()} added`,
        type: 'success',
      })

      return returnedBlog
    } catch (error) {
      setNotification({
        message: `Failed to create blog. Title, author, and url are required. ${error.message}`,
        type: 'error',
      })
    }
  }

  const handleLike = async (blog) => {
    const blogToUpdate = {
      ...blog,
      likes: blog.likes + 1,
      // The backend usually expects the user ID as a string for PUT
      user: blog.user.id,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, blogToUpdate)

      // FIX: The backend returnedBlog might have 'user' as a string ID.
      // We create a version for our state that keeps the original 'blog.user' object.
      const updatedBlogForState = {
        ...returnedBlog,
        user: blog.user,
      }
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlogForState)))
    } catch (error) {
      setNotification({
        message: `Error updating likes: ${error.message}`,
        type: 'error',
      })
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        setNotification({
          message: `Deleted ${blog.title} by ${blog.author}`,
          type: 'success',
        })
      } catch (error) {
        setNotification({
          message: `Error deleting blog: ${error.message}`,
          type: 'error',
        })
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <Login
          handleLogin={handleLogin}
          username={username}
          handleUsernameChange={handleUsernameChange}
          password={password}
          handlePasswordChange={handlePasswordChange}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <Blogs
        user={user}
        blogs={blogs}
        handleLogout={handleLogout}
        createBlog={handleCreateBlog}
        blogFormRef={blogFormRef} // 3. Pass the ref down
        handleLike={handleLike}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App
