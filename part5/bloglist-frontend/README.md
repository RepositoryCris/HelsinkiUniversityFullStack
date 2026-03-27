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
