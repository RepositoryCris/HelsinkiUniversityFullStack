# Part 5

## 5.1 Blog List Frontend step 1

Clone the application from GitHub with the command:

```bash
`git clone https://github.com/fullstack-hy2020/bloglist-frontendcopy`
```

Remove the git configuration of the cloned application

```bash
cd bloglist-frontend   // go to cloned repository
rm -rf .git
```

The application is started the usual way, but you have to install its dependencies first:

```bash
npm install
npm run dev
```

### Configure a Vite Proxy

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
});
```

## 5.2 Blog List Frontend Step 2

### Local Storage for Login Persistence

Problem: User logs out when browser refreshes.

Solution: Save user data to local storage.

Methods:

- `localStorage.setItem('key', value)` - store string

- `localStorage.getItem('key')` - retrieve

- `localStorage.removeItem('key')` - delete

Implementation:

```javascript
// Login - save user
const userJSON = JSON.stringify(user);
localStorage.setItem("loggedUser", userJSON);

// App load - restore user
const savedUser = JSON.parse(localStorage.getItem("loggedUser"));

// Logout - clear
localStorage.removeItem("loggedUser");
```

Storage only accepts strings, so use `JSON.stringify()` and `JSON.parse()`

### Update handleLogin to Save the Session

In your `handleLogin` function, once the server returns a successful user object, you need to stringify it and store it in `localStorage`.

```js
const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const user = await loginService.login({ username, password });

    // --- ADDED FOR 5.2 ---
    window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
    // ---------------------

    blogService.setToken(user.token);
    setUser(user);
    setUsername("");
    setPassword("");
  } catch {
    setErrorMessage("wrong credentials");
    setTimeout(() => setErrorMessage(null), 5000);
  }
};
```

### Add a useEffect to Load the Session on Startup

You need a "hook" that runs exactly once when the application starts up. It checks if that specific key exists in `localStorage`.

```JavaScript
useEffect(() => {
const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
if (loggedUserJSON) {
const user = JSON.parse(loggedUserJSON);
setUser(user);
blogService.setToken(user.token);
}
}, []);
```

**Note:** Make sure to call `blogService.setToken(user.token)` inside this effect, otherwise, your subsequent requests to create or delete blogs will fail because the service won't have the token!

### Implement the Logout Functionality

To "log out," you simply need to clear the state and remove the item from the browser's storage.

In `App.jsx`:

```JavaScript
const handleLogout = () => {
window.localStorage.removeItem('loggedBlogappUser');
setUser(null);
};
```
