# 4.1 Blog list

## Main folder

- mkdir `part3`, `E4.1BlogList`
- In root `E4.1BlogList` star a new branch `git switch -c part4`

## New node project

- `npm init` answer the questions

```bash
PS D:\HelsinkiUniversityFullStack\part4\E4.1BlogList> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (e4.1bloglist)
version: (1.0.0)
description: Blog list
entry point: (index.js) index.js
test command:
git repository:
keywords:
author: Cristian Mamani Aguirre
license: (ISC)
About to write to D:\HelsinkiUniversityFullStack\part4\E4.1BlogList\package.json:

{
  "name": "e4.1bloglist",
  "version": "1.0.0",
  "description": "Blog list",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Cristian Mamani Aguirre",
  "license": "ISC"
}


Is this OK? (yes)
```

### package.json created

```json
{
  "name": "e4.1bloglist",
  "version": "1.0.0",
  "description": "Blog list",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Cristian Mamani Aguirre",
  "license": "ISC"
}
```

### Install dependencies

Express

```bash
npm install express
```

Mongoose

```bash
npm install mongoose
```

Actual `package.json`

```json
{
  "name": "e4.1bloglist",
  "version": "1.0.0",
  "description": "Blog list",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Cristian Mamani Aguirre",
  "license": "ISC",
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^9.3.1"
  }
}
```

### Automatic Change Tracking

To make the server track the changes

```bash
node --watch index.js
```

Now, changes to the application's code will cause the server to restart automatically.

```json
{
  "name": "e4.1bloglist",
  "version": "1.0.0",
  "description": "Blog list",
  "main": "index.js",
  "scripts": {
    "dev": "node --watch index.js", //<--add this line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Cristian Mamani Aguirre",
  "license": "ISC",
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^9.3.1"
  }
}
```

Start the server in development mode

```bash
npm run dev
```

### Run as a script

Add in `package.json`

```bash
"scripts": {
  "start": "node index.js",
```

Actual `package.json`

```json
{
  "name": "e4.1bloglist",
  "version": "1.0.0",
  "description": "Blog list",
  "main": "index.js",
  "scripts": {
    "start": "node index.js", //<--add this line
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Cristian Mamani Aguirre",
  "license": "ISC",
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^9.3.1"
  }
}
```

### Running the app

#### Development mode

```bash
npm run dev
```

#### Production mode

```bash
npm start
```

## Mongo DB Atlas, create database

- Go to `Cluster0` click on `connect` look for `drivers` and `copy` the mongo connection string **mongodb+srv://`data base user`:`data base password`@cluster0.i0zdjs6.mongodb.net/`data base name`?appName=Cluster0**

Remember to use the correct `data base user` and `data base password`. Also if you want to give a name to the database assure to give a name before the query parameters _mongodb.net/`data base name`?_

## Environment Variables with dotenv

- Install dotenv:

```bash
npm install dotenv
```

- Create `.env` file and assign the Mongo DB address

```bash
MONGODB_URI="mongodb_connection_string"
PORT=3003
```

- Create a `.gitignore` file and add:

```bash
#.gitignore file

.env
```

After adding `.env` notice that the color of this file in the file structure will be a little bit darker.

By the way also add:

```bash
#.gitignore file
.env
node_modules
```

- Import `dotenv` in `index.js` file

```js
require("dotenv").config(); // MUST be the first line in index.js file
```

- Use it in `index.js`

```js
const mongoUrl = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003;
```

- Then `npm run dev`

```bash
PS D:\HelsinkiUniversityFullStack\part4\E4.1BlogList> npm run dev

> e4.1bloglist@1.0.0 dev
> node --watch index.js

[dotenv@17.3.1] injecting env (2) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
Server running on port 3003
```

## Create tests for all endpoints

Tests in vs rest client

```bash
@baseurl = http://localhost:3003

### GET all blogs
GET {{baseurl}}/api/blogs
# Expected: 200 OK
# Body: An array of blog objects (empty [] if first time)

### [SUCCESS] Post a valid new blog
POST {{baseurl}}/api/blogs
Content-Type: application/json

{
  "title": "Systems Engineering in Node",
  "author": "Cristian Mamani",
  "url": "https://fullstackopen.com/",
  "likes": 5
}
### Expected: 201 Created
### Body: The saved blog object including _id and __v
```

### Mongoose connection with then and catch

```bash
console.log("connecting to", mongoUrl);
mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
```
