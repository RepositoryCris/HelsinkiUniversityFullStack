import { useState, useEffect } from "react";

import blogService from "./services/blog";
import loginService from "./services/login";
import Login from "./components/Login";
import Blogs from "./components/Blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  //const [newBlog, setNewBlog] = useState("");
  //const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const apiBlogs = () => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await blogService.getBlogs();
        setBlogs(blogsData);
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        //
      }
    };

    fetchBlogs();
  };

  useEffect(() => {
    apiBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value);
  };
  const handlePasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      ("");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      return returnedBlog;
    } catch (error) {
      setErrorMessage("Failed to create blog", error);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        {/*<Notification message=*/ <div>{errorMessage}</div>}
        <Login
          handleLogin={handleLogin}
          username={username}
          handleUsernameChange={handleUsernameChange}
          password={password}
          handlePasswordChange={handlePasswordChange}
        />
      </div>
    );
  }

  return (
    <div>
      <Blogs
        user={user}
        blogs={blogs}
        handleLogout={handleLogout}
        createBlog={handleCreateBlog}
      />
    </div>
  );
};

export default App;
