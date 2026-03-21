# Part 4

## 4.1 Blog list

### Main folder

- mkdir `part3`, `E4.1BlogList`
- In root `E4.1BlogList` star a new branch `git switch -c part4`

### New node project

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

#### package.json created

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

#### Install dependencies

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

#### Automatic Change Tracking

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

#### Run as a script

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

### Environment Variables with dotenv

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

### Create tests for all endpoints

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

## Mongoose connection with then and catch

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

## 4.2 Blog list refactor

### Project structure

#### Utils logger

Separate all printing to the console to its own module `utils/logger.js`:

```js
const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

module.exports = { info, error };
```

The logger has **two functions**, `info` for printing normal log messages, and `error` for all error messages.

Then import

```js
const logger = require("./utils/logger");
```

#### Utils config

The handling of environment variables is extracted into a separate `utils/config.js` file:

```js
require("dotenv").config();

const PORT = process.env.PORT || 3003;

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = { MONGODB_URI, PORT };
```

The import

```js
const config = require("./utils/config");
```

### Controllers blogs

Create a file `/controllers/blogs.js`

```js
const blogsRouter = require("express").Router();

const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
```

### Model blog

Create a file `/models/blog.js`

```js
const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
```

### App.js

In the root create `app.js` file

```js
const config = require("./utils/config");
const express = require("express");
const app = express();

const blogsRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```

### Middleware

Create a file `/utils/middleware.js`

```js
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
```

### index.js

Finally we listen to the PORT in `index.js`

```js
const config = require("./utils/config");
const app = require("./app"); // the actual Express application
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
```

## 4.3: Helper Functions and Unit Tests, step 1

Create a directory named `utils` and add the file `list_helper.js.` This will house your logic functions.

File: `utils/list_helper.js`

```js
const dummy = (blogs) => {
  // This function currently just validates the test setup
  return 1;
};

module.exports = {
  dummy,
};
```

### Create the Test File `list_helper.test.js.`

Create a directory named tests and add a file named `list_helper.test.js.` It is a common convention to match the name of the file you are testing.

File: `tests/list_helper.test.js`

```JavaScript
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
```

### Run tests

```bash
node --test tests/list_helper.test.js
```

## Test library node:test

Define the npm script test for the test execution:

```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "node --test", //<--Add this line
    "lint": "eslint ."
  }
  // ...
}
```

Now, you can simply run

```bash
npm test
```

to execute all tests in your project

## 4.4: Helper Functions and Unit Tests, step 2

### Test describe blocks

Describe blocks can be used for grouping tests into logical collections.

```js
describe("name of the block", () => {
  // All the tests here.
});
```

Example:

```js
const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const emptyList = [];
  const listWithOneBlog = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
  ];
  const listWithMultipleBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes(emptyList), 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 7);
  });

  test("of a bigger list is calculated correctly", () => {
    assert.strictEqual(listHelper.totalLikes(listWithMultipleBlogs), 29);
  });
});
```

The test output also uses the name of the describe block:

```bash
PS D:\HelsinkiUniversityFullStack\part4\E4.1BlogList> npm test

> e4.1bloglist@1.0.0 test
> node --test

✔ dummy returns one (2.1358ms)
▶ total likes
  ✔ of empty list is zero (0.5722ms)
  ✔ when list has only one blog, equals the likes of that (0.4272ms)
  ✔ of a bigger list is calculated correctly (0.4811ms)
✔ total likes (2.389ms)
ℹ tests 4
ℹ suites 1
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 251.0044
```

## 4.5: Helper Functions and Unit Tests, step 3

### Node.js Assertion Comparison: `strictEqual` vs `deepStrictEqual`

As a system engineer, you can think of this as comparing a **Pointer** versus the **Data** at that pointer.

### Comparison Table

| Feature           | `assert.strictEqual(a, b)`                                     | `assert.deepStrictEqual(a, b)`                             |
| :---------------- | :------------------------------------------------------------- | :--------------------------------------------------------- |
| **Common Name**   | Identity / Reference Equality                                  | Structural / Value Equality                                |
| **Logic**         | Checks if both variables point to the **same memory address**. | Recursively checks if **all properties and values** match. |
| **Operator**      | Uses the `===` operator.                                       | Traverses the object tree (Recursive).                     |
| **Best Used For** | Primitives (Strings, Numbers, Booleans).                       | Objects, Arrays, and Nested Data.                          |
| **Performance**   | Extremely fast ($O(1)$).                                       | Slower ($O(n)$ where $n$ is the number of properties).     |

---

### The "System Memory" Visualization

Imagine you have two variables, `blog1` and `blog2`, that contain the exact same data.

#### 1. Reference Check (`strictEqual`)

The computer looks at the **Stack**. It sees that `blog1` points to **Address 0x001** and `blog2` points to **Address 0x002**.

- **Result:** **FAIL** ❌. Even though the data is the same, the memory addresses are different.

#### 2. Value Check (`deepStrictEqual`)

The computer follows the pointers to the **Heap**. It looks at the bits stored at `0x001` and compares them bit-by-bit to the bits at `0x002`.

- **Result:** **PASS** ✅. The content matches perfectly.

---

### Use Cases in the Blog Project

- **Use `strictEqual`** when checking `totalLikes`. Since the result is a simple Number (a primitive), you only care if the value is, for example, `12`.
- **Use `deepStrictEqual`** for `favoriteBlog`. Since you are comparing an object you _created_ in your test to an object _returned_ by your function, they will **never** have the same memory address, but they will have the same content.

### Summary Rule of Thumb

- **Simple Value** (Number/String) $\rightarrow$ `strictEqual`
- **Structural Value** (Curly Braces `{}` or Brackets `[]`) $\rightarrow$ `deepStrictEqual`

### Result of tests describe blocks

```bash
✔ dummy returns one (1.698ms)
▶ total likes
  ✔ of empty list is zero (0.6304ms)
  ✔ when list has only one blog, equals the likes of that (0.333ms)
  ✔ of a bigger list is calculated correctly (0.2582ms)
✔ total likes (2.0812ms)
▶ most likes
  ✔ of empty list is null (2.7326ms)
  ✔ when list has only one blog, equals that blog (1.267ms)
  ✔ of a bigger list finds the correct favorite (0.5393ms)
✔ most likes (5.1433ms)
ℹ tests 7
ℹ suites 2
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 253.2093
```

### 4.6: Helper Functions and Unit Tests, step 4

This command installs Lodash as a project dependency.

```bash
npm install --save lodash
```

Import and use

```js
const _ = require("lodash");

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  return _.chain(blogs)
    .countBy("author") // 1. Creates { "Robert C. Martin": 3, "Edsger W. Dijkstra": 1 }
    .map((count, author) => ({
      // 2. Transforms each pair into the required object format
      author: author,
      blogs: count,
    }))
    .maxBy("blogs") // 3. Picks the object with the highest 'blogs' value
    .value(); // 4. Executes the chain and returns the result
};
```

#### Lowdash

| Function        | Purpose                                   | Example                               |
| :-------------- | :---------------------------------------- | :------------------------------------ |
| **`_.countBy`** | Counts occurrences of a property.         | `_.countBy(blogs, 'author')`          |
| **`_.groupBy`** | Groups objects into an object by key.     | `_.groupBy(blogs, 'author')`          |
| **`_.sumBy`**   | Sums a specific property in an array.     | `_.sumBy(blogs, 'likes')`             |
| **`_.maxBy`**   | Finds the object with the maximum value.  | `_.maxBy(authors, 'blogs')`           |
| **`_.map`**     | Transforms a collection into a new array. | `_.map(obj, (val, key) => ({ ... }))` |
| **`_.chain`**   | Enables method wrapping for sequences.    | `_.chain(blogs)...`                   |
| **`.value()`**  | Resolves the result of a chain.           | `...value()`                          |

#### The "Chaining" Pattern

Use `_.chain()` to pipe data through multiple transformations. Always end with `.value()`

```JavaScript
const topAuthor = _.chain(blogs)
  .countBy('author')
  .map((count, name) => ({ author: name, blogs: count }))
  .maxBy('blogs')
  .value()
```
