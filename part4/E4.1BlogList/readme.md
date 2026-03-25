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

## 4.6-7: Helper Functions and Unit Tests, step 4

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

### Lowdash

| Function        | Purpose                                   | Example                               |
| :-------------- | :---------------------------------------- | :------------------------------------ |
| **`_.countBy`** | Counts occurrences of a property.         | `_.countBy(blogs, 'author')`          |
| **`_.groupBy`** | Groups objects into an object by key.     | `_.groupBy(blogs, 'author')`          |
| **`_.sumBy`**   | Sums a specific property in an array.     | `_.sumBy(blogs, 'likes')`             |
| **`_.maxBy`**   | Finds the object with the maximum value.  | `_.maxBy(authors, 'blogs')`           |
| **`_.map`**     | Transforms a collection into a new array. | `_.map(obj, (val, key) => ({ ... }))` |
| **`_.chain`**   | Enables method wrapping for sequences.    | `_.chain(blogs)...`                   |
| **`.value()`**  | Resolves the result of a chain.           | `...value()`                          |

### The "Chaining" Pattern

Use `_.chain()` to pipe data through multiple transformations. Always end with `.value()`

```JavaScript
const topAuthor = _.chain(blogs)
  .countBy('author')
  .map((count, name) => ({ author: name, blogs: count }))
  .maxBy('blogs')
  .value()
```

## 4.8 Blog List Tests, step 1

### Configurations to implement a test environment with its own database

Change the scripts in the blogs application `package.json` file, so that when tests are run, `NODE_ENV` gets the value test:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js", //check
    "dev": "NODE_ENV=development node --watch index.js", //check
    "test": "NODE_ENV=test node --test", //add this
    "lint": "eslint ."
  }
  // ...
}
```

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the `cross-env` package as a project dependency using the command:

```bash
npm install cross-env
```

We can then achieve cross-platform compatibility by using the cross-env library in our npm scripts defined in `package.json`

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development node --watch index.js",
    "test": "cross-env  NODE_ENV=test node --test",
    "lint": "eslint ."
  }
  // ...
}
```

Now we can modify the way that our application runs in different modes.

**_As an example of this, we could define the application to use a separate test database when it is running tests._**

Let's make some changes to the module that defines the application's configuration in utils/config.js:

```js
require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI = //
  process.env.NODE_ENV === "test" //
    ? process.env.TEST_MONGODB_URI //
    : process.env.MONGODB_URI; //

module.exports = {
  MONGODB_URI,
  PORT,
};
```

The `.env` file has separate variables for the database addresses of the **development** and **test** _databases_:

```bash
MONGODB_URI=mongodb+srv:...
PORT=3001

TEST_MONGODB_URI=mongodb+srv:...
```

Just create a new data base for test called `testBlogList` with your own credentials and user

### Supertest

Use the **supertest package** to help us write our tests for testing the API.

```bash
npm install --save-dev supertest
```

Write the first test in the `tests/blogs_api.test.js` file:

```js
const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
```

The test imports the Express application from the app.js module and **wraps it with the supertest function into a so-called superagent object**.
This object is assigned to the api variable and tests can use it for making HTTP requests to the backend.

- The test makes an HTTP GET request to the api/notes url
- Verifies that the request is responded to with the status code 200
- erifies that the Content-Type header is set to application/json, indicating that the data is in the desired format

Checking the value of the header uses a bit strange looking syntax:

```js
.expect('Content-Type', /application\/json/)
```

**The desired value is now defined as regular expression or in short regex.**

_The regex starts and ends with a slash /_, and because the **desired string application/json** also contains the same slash, it is **preceded by a \ so** that it is not interpreted as a regex termination character.

In principle, the test could also have been defined as a string

```bash
.expect('Content-Type', 'application/json')copy
```

The **problem** here, however, is that when using a string, the **value of the header must be exactly the same**.

- For **the regex we defined**, it is acceptable that the **header contains the string in question.**
- The actual value of the header is **application/json; charset=utf-8**, i.e. it **also contains information about character encoding**.
- However, the test is not interested in this and therefore it is **better to define the test as a regex instead of an exact string**.

The async/await syntax is related to the fact that making a request to the API is an asynchronous operation.
The async/await syntax can be used for writing asynchronous code with the appearance of synchronous code.

Once all the tests have finished running we have to close the database connection used by Mongoose. Without this, the test program will not terminate.

This can be easily achieved with the after method:

```js
after(async () => {
  await mongoose.connection.close();
});
```

The documentation for supertest says the following:

_if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports._

#### The "Logic" vs. The "Port"

In a typical Express project, you usually have two main files for starting the app:

- `app.js`: This contains all your middleware, routes (like `/api/blogs`), and database connections. It defines how the app behaves, but it doesn't actually "start" the engine.

- `index.js`: This is where you call `app.listen(3003)`. This tells the app to sit and wait for requests on a specific port.

When you import `app` into your test file, you are **importing the logic**, not the **running process**.

#### What SuperTest does (The "Ephemeral Port")

When you run `const api = supertest(app)`, SuperTest takes your Express app and handles the "starting" part for you internally.

- **Ephemeral Port:** Instead of using port 3003 (which might be busy if you are running the app in another terminal), SuperTest asks the Operating System for any random, available port (e.g., 54231).

- **Automated Lifecycle:** It starts the server on that random port, sends your test request (like GET /api/blogs), gets the response, and then **immediately shuts the server down**.

#### Why is this better?

| Feature           | Manual Testing (Postman)                    | SuperTest Logic                                 |
| :---------------- | :------------------------------------------ | :---------------------------------------------- |
| **Port Conflict** | If port 3003 is taken, the app crashes.     | Uses a random port; never conflicts.            |
| **Speed**         | You have to manually start/stop the server. | Starts and stops in milliseconds automatically. |
| **Environment**   | Usually runs on your "Dev" database.        | Can easily point to your "Test" database.       |

In your `tests/blog_api.test.js`, you don't need to worry about `app.listen()`. By passing `app` to `supertest(app)`, you are giving the library a "blueprint" of your API. SuperTest builds a temporary, private bridge to that blueprint every time you run a test.

Your tests will work even if your main server is turned off, because SuperTest is essentially spinning up a "ghost" version of your app just for the duration of the test.

Add tests and then we will add the list

```js
const assert = require("node:assert");
// ...

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const contents = response.body.map((e) => e.content);
  assert(contents.includes("React patterns"));
});
```

The middleware that outputs information about the HTTP requests is obstructing the test execution output. Let us modify the logger so that it does not print to the console in test mode:

```js
const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
};
```

### Initializing the database before tests

Currently, our tests have an issue where their success depends on the state of the database.

Let's initialize the database before every test with the `beforeEach` function:

```js
const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test"); //<--
const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog"); //<--

const api = supertest(app);

const initialBlogs = [
  //<--
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
];

beforeEach(async () => {
  //<--
  await Blog.deleteMany({});
  let blogObject = new Note(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Note(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const contents = response.body.map((e) => e.content);
  assert(contents.includes("React patterns"));
});

after(async () => {
  await mongoose.connection.close();
});
```

The database is cleared out at the beginning, and after that, we save the two notes stored in the initialNotes array to the database. By doing this, we ensure that the database is in the same state before every test is run.

### Running tests one by one

The npm test command executes all of the tests for the application. When we are writing tests, it is usually **wise to only execute one or two tests.**

There are a few different ways of accomplishing this, one of which is the **only** method. With this method we can define in the code what tests should be executed:

```js
test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});
```

When tests are run with option --test-only, that is, with the command:

```bash
npm test -- --test-only
```

The danger of `only` is that **one forgets to remove those from the code.**

Another option is to specify the tests that need to be run as arguments of the npm test command.

The following command only runs the tests found in the `tests/blog_api.test.js` file:

```bash
npm test -- tests/note_api.test.jscopy
```

The `--test-name-pattern` option can be used for running tests with a specific name:

```bash
npm test -- --test-name-pattern="a specific blog is within the returned blogs"
```

The provided argument can refer to the name of the test or the describe block. It can also contain just a part of the name. The following command will run all of the tests that contain blogs in their name:

```bash
npm run test -- --test-name-pattern="blogs"
```

### async/await

The async/await syntax that was introduced in ES7 makes it possible to use asynchronous functions that return a promise in a way that makes the code look synchronous.

- `async`: A keyword placed before a function declaration. It ensures the function **always returns a promise**. Even if you return a simple string, JavaScript wraps it in a resolved promise automatically.

- `await`: A keyword used only inside an async function. it tells JavaScript to **pause execution** at that line until the Promise settles (either resolves or rejects). Once resolved, it returns the result of the promise as a normal value.

### Rules to Remember

- **Await needs Async:** You cannot use `await` in a regular function; the parent function must be marked `async`.

- **Non-Blocking:** Even though the code "pauses" at the `await` line, the JavaScript event loop is still free to handle other requests. It doesn't freeze your whole server.

- **Error Handling:** Instead of `.catch()`, you use standard `try/catch` blocks around your `await` calls to handle errors.

### How to Run the Tests

Here is the correct way to run your tests while staying safely inside the **test database**:

- **Run EVERYTHING**
  This runs all files in your `tests` folder using the test database.

```Bash
npm test
```

- **Run a SPECIFIC FILE**
  If you want to run only `blogs_api.test.js` without touching your other logic tests, use the -- separator. This tells npm to pass the following arguments directly to the node command _inside_ the script.

```Bash
npm test -- tests/blogs_api.test.js
```

**_"it is better to not execute them all, only execute the ones you are working on."_ To save time and keep your Atlas cluster from hitting connection limits**

- **Run a SINGLE TEST by name**
  If you are debugging one specific failing test and don't want to wait for the others, combine the pattern flag with the file path:

```Bash
npm test -- --test-name-pattern="a blog can be deleted" tests/blogs_api.test.js
```

**Why the `--` is important**
Think of `npm test` as a specialized container.

- Everything **inside** the container knows it's in "test mode" (`NODE_ENV=test`).

- The `--` acts like a door. Anything you type **after** it gets thrown inside that container and attached to the command `node --test`.

When you ran `npm test`, the following chain occurred:

1. `cross-env` set `NODE_ENV` to `test`.
2. `utils/config.js` saw that value and picked `TEST_MONGODB_URI`.
3. `mongoose` connected to `testBlogList`.
4. Your `beforeEach` wiped the **test database** and inserted the `helper` blogs.
5. Your production `blogList` database stayed exactly as it was.

## 4.9 Blog List Tests, step 2

Write a test that verifies that the unique identifier property of the blog posts is named id, by default the database names the property \_id.

Update your `models/blog.js`:

```JavaScript
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

// Add the transformation logic here
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
```

- Write the Test
  Add this new test case to your `tests/blogs_api.test.js`.
  This test fetches the blogs and checks if the first object has a property named `id` and does _not_ have `_id`.

```JavaScript
test('unique identifier property is named id', async () => {
const response = await api.get('/api/blogs')

// Check the first blog in the response
const blogToDiagnostics = response.body[0]

assert.ok(blogToDiagnostics.id)
assert.strictEqual(typeof blogToDiagnostics._id, 'undefined')
assert.strictEqual(typeof blogToDiagnostics.__v, 'undefined')
})
```

Now, run the specific test file to confirm it passes without running your entire suite of 21 tests:

```Bash
npm test -- tests/blogs_api.test.js
```

## 4.11 Blog List Tests, step 4

Write a test that verifies that if the likes property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.

### Update the Schema

Modify the `likes` definition to include a `default` value. This is the most efficient fix because it happens automatically at the database layer.

```JavaScript
// models/blog.js

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0  // <--- This ensures if 'likes' is missing, it becomes 0
  }
})

```

Add this test

```js
test("if the likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Testing default likes",
    author: "Cristian Aguirre",
    url: "https://fullstackopen.com/",
    // likes is intentionally missing
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Verify the response body directly
  assert.strictEqual(response.body.likes, 0);
});
```

## 4.15 Blog List Expansion, step 3

## Mongoose schema for users

Define the model for representing a user in the `models/user.js` file:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

The field type is ObjectId, meaning it refers to another document. The ref field specifies the name of the model being referenced. Mongo does not inherently know that this is a field that references blogs, the syntax is purely related to and defined by Mongoose.

Let's expand the schema of the blog defined in the models/blog.js file so that the blog contains information about the user who created it:

```js
//...
   likes: {
    type: Number,
    default: 0, // <--- This ensures if 'likes' is missing, it becomes 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
//...
```

## Creating users

Let's implement a route for creating new users. Users have a unique username, a name and something called a passwordHash. The password hash is the output of a one-way hash function applied to the user's password. It is never wise to store unencrypted plain text passwords in the database!

Let's install the bcrypt package for generating the password hashes:

```bash
PS D:\HelsinkiUniversityFullStack\part4\E4.1BlogList> npm install bcrypt

added 3 packages, and audited 116 packages in 5s

28 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Define a separate router for dealing with users in a new `controllers/users.js` file

Let's take the router into use in our application in the `app.js` file, so that it handles requests made to the `/api/users` url:

```js
// ...
const blogsRouter = require("./controllers/blogs");

const usersRouter = require("./controllers/users");

// ...

app.use("/api/blogs", blogsRouter);

app.use("/api/users", usersRouter);

// ...
```

The contents of the file, controllers/users.js, that defines the router is as follows:

```js
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
```

The new feature can and should initially be tested manually with a tool like Postman. However testing things manually will quickly become too cumbersome, especially once we implement functionality that enforces usernames to be unique.

It takes much less effort to write automated tests, and it will make the development of our application much easier.

Our initial tests could look like this:

```js
const bcrypt = require("bcrypt");
const User = require("../models/user");

//...

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});
```

The tests use the usersInDb() helper function that we implemented in the `tests/test_helper.js` file. The function is used to help us verify the state of the database after a user is created:

```js
const User = require("../models/user");

// ...

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
```

The beforeEach block adds a user with the username root to the database. We can write a new test that verifies that a new user with the same username can not be created:

```js
describe("when there is initially one user in db", () => {
  // ...

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
```

The test case obviously will not pass at this point. We are essentially practicing **test-driven development (TDD)**, where tests for new functionality are written before the functionality is implemented.

Mongoose validations do not provide a direct way to check the uniqueness of a field value. However, it is possible to achieve uniqueness by defining `uniqueness index` for a field. The definition is done as follows:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String, //
    required: true, //
    unique: true, // this ensures the uniqueness of username
  }, //
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

// ...
```

Uniqueness indexes fail to create if duplicate data already exists—ensure the database is clean beforehand.
Unlike standard Mongoose validations, duplicate violations throw a `MongoServerError`, so the error handler must be extended to handle this case.

```js
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    //
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    //
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" }); //
  } //

  next(error);
};
```

After these changes, the tests will pass.

Before we move onward, let's add an initial implementation of a route handler that returns all of the users in the database:

```js
usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});
```

For making new users in a production or development environment, you may send a POST request to /api/users/ via Postman or REST Client in the following format:

```json
{
  "username": "root",
  "name": "Superuser",
  "password": "salainen"
}
```

Test with rest client:

```bash
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-PZ3ulkCsSUL/IbFi7jwkcjDlI3k"
Date: Wed, 25 Mar 2026 00:08:33 GMT
Connection: close

{
  "username": "root",
  "name": "Superuser",
  "blogs": [],
  "id": "69c3278153f22852f28b7859"
}
```

The console looks like this:

```bash
[dotenv@17.3.1] injecting env (3) from .env -- tip: 🤖 agentic secret storage: https://dotenvx.com/as2
connecting to mongodb+srv://fullstack_db_user:JybRTpccMzTlf8Zu@cluster0.i0zdjs6.mongodb.net/blogList?appName=Cluster0
Server running on port 3003
connected to MongoDB
Method: POST
Path:   /api/users/
Body:   { username: 'root', name: 'Superuser', password: 'salainen' }
---
```

And in mongoDB a collection users was created

```json
{
  "_id": {
    "$oid": "69c3278153f22852f28b7859"
  },
  "username": "root",
  "name": "Superuser",
  "passwordHash": "$2b$10$29DxaJEdoo72YUi4SeKW9efXgP6m.VsTMdNkwKXOQA4MqCk5azs2i",
  "blogs": [],
  "__v": 0
}
```

## Creating a new blog

The code for creating a new note has to be updated so that the note is assigned to the user who created it.

Let's expand our current implementation in `controllers/blogs.js` so that the information about the user who created a blog is sent in the userId field of the request body:

```js
blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId);

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedBlog);
});
```

The database is first queried for a user using the userId provided in the request. If the user is not found, the response is sent with a status code of 400 (Bad Request) and an error message: `"userId missing or not valid"`.

It's worth noting that the user object also changes. The id of the blog is stored in the blogs field of the user object:

```js
const user = await User.findById(body.userId);

// ...

user.blogs = user.blogs.concat(savedNote._id);
await user.save();
```

Let's try to create a new note

```bash
### [SUCCESS] Post a valid new blog
POST {{baseurl}}/api/blogs/
Content-Type: application/json

{
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": "0",
    "userId": "69c3278153f22852f28b7859"
}
### Expected: 201 Created
```

Result

```bash
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 224
ETag: W/"e0-+dk7e97PiJJfdDzfoyalVpCXr0I"
Date: Wed, 25 Mar 2026 01:01:05 GMT
Connection: close

{
  "title": "User id of the blog creator is at the start sent along the request",
  "author": "Cristian Mamani Aguirre",
  "url": "https://fullstackopen.com/",
  "likes": 0,
  "user": "69c3278153f22852f28b7859",
  "id": "69c333d17e41aff1b0dc1a3d"
}
```

If you see this data in users in mongoDB there are four blogs added to this user

```bash
_id: ObjectId('69c3278153f22852f28b7859')
username: "root"
name: "Superuser"
passwordHash: "$2b$10$29DxaJEd0o72YUi4SeKW9efXgP6m.VsTMdNkwKXOQA4MqCk5azs2i"
blogs: Array (4)
  0: ObjectId('69c333547e41aff1b0dcla31')
  1: ObjectId('69c333647e41aff1b0dcla35')
  2: ObjectId('69c333687e41aff1b0dcla39')
  3: ObjectId('69c333d17e41aff1b0dcla3d')
__v: 4
```

The operation appears to work.

Likewise, the ids of the users who created the blogs can be seen when we visit the route for fetching all notes:

```bash
_id: ObjectId('69c333547e41aff1b0dcla31')
title: "User id of the blog creator is at the start sent along the request"
author: "Cristian Mamani Aguirrer"
url: "https://fullstackopen.com/"
likes: 0
user: ObjectId('69c3278153f22852f28b7859')
__v: 0


_id: ObjectId('69c333647e41aff1b0dcla35')
title: "User id of the blog creator is at the start sent along the request"
author: "Cristian Mamani Aguirrer"
url: "https://fullstackopen.com/"
likes: 0
user: ObjectId('69c3278153f22852f28b7859')
__v: 0


_id: ObjectId('69c333687e41aff1b0dcla39')
title: "User id of the blog creator is at the start sent along the request"
author: "Cristian Mamani Aguirrer"
url: "https://fullstackopen.com/"
likes: 0
user: ObjectId('69c3278153f22852f28b7859')
__v: 0


_id: ObjectId('69c333d17e41aff1b0dcla3d')
title: "User id of the blog creator is at the start sent along the request"
author: "Cristian Mamani Aguirrer"
url: "https://fullstackopen.com/"
likes: 0
user: ObjectId('69c3278153f22852f28b7859')
__v: 0
```

Now look in the web `http://localhost:3003/api/blogs/`

```json
[
  {
    "title": "First class tests",
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    "likes": 10,
    "id": "69c1c95d2be88c91698d0c50"
  },
  {
    "title": "React patterns",
    "author": "Michael Chan",
    "url": "https://reactpatterns.com/",
    "likes": 7,
    "id": "69c1c95d2be88c91698d0c51"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": "69c3278153f22852f28b7859",
    "id": "69c333547e41aff1b0dc1a31"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": "69c3278153f22852f28b7859",
    "id": "69c333647e41aff1b0dc1a35"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": "69c3278153f22852f28b7859",
    "id": "69c333687e41aff1b0dc1a39"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": "69c3278153f22852f28b7859",
    "id": "69c333d17e41aff1b0dc1a3d"
  }
]
```

And also users:

```json
[
  {
    "username": "root",
    "name": "Superuser",
    "blogs": [
      "69c333547e41aff1b0dc1a31",
      "69c333647e41aff1b0dc1a35",
      "69c333687e41aff1b0dc1a39",
      "69c333d17e41aff1b0dc1a3d"
    ],
    "id": "69c3278153f22852f28b7859"
  }
]
```

## Populate

- Relational DB: Uses transactional JOIN queries (consistent state)

- MongoDB + Mongoose: Uses populate() method, which executes multiple separate queries (no transactional guarantee — data may change during the process)

Update the route in `controllers/users.js` using Mongoose's `populate()`.

```js
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs"); //
  response.json(users); //
});
```

### How populate() Works

- Chained after `find()` to modify the query result

- **Argument:** Specifies which field (e.g., `blogs`) should have its IDs replaced with actual document references

- **Process:**
  1. Queries the **users** collection for all users
  2. Queries the **blogs** collection (or whatever `ref` property points to in the schema) for documents matching the IDs

- The result combines both queries, replacing ID references with full document objects

The result is this, now we can see the ids and the blogs
The result is almost exactly what we wanted:

```json
[
  {
    "username": "root",
    "name": "Superuser",
    "blogs": [
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "author": "Cristian Mamani Aguirre",
        "url": "https://fullstackopen.com/",
        "likes": 0,
        "user": "69c3278153f22852f28b7859",
        "id": "69c333547e41aff1b0dc1a31"
      },
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "author": "Cristian Mamani Aguirre",
        "url": "https://fullstackopen.com/",
        "likes": 0,
        "user": "69c3278153f22852f28b7859",
        "id": "69c333647e41aff1b0dc1a35"
      },
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "author": "Cristian Mamani Aguirre",
        "url": "https://fullstackopen.com/",
        "likes": 0,
        "user": "69c3278153f22852f28b7859",
        "id": "69c333687e41aff1b0dc1a39"
      },
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "author": "Cristian Mamani Aguirre",
        "url": "https://fullstackopen.com/",
        "likes": 0,
        "user": "69c3278153f22852f28b7859",
        "id": "69c333d17e41aff1b0dc1a3d"
      }
    ],
    "id": "69c3278153f22852f28b7859"
  }
]
```

We can use the populate method for choosing the fields we want to include from the documents. In addition to the field id we are now only interested in title.

The selection of fields is done with the Mongo syntax:

```js
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1 });

  response.json(users);
});
```

The result is now exactly like we want it to be:

```json
[
  {
    "username": "root",
    "name": "Superuser",
    "blogs": [
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "id": "69c333547e41aff1b0dc1a31"
      },
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "id": "69c333647e41aff1b0dc1a35"
      },
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "id": "69c333687e41aff1b0dc1a39"
      },
      {
        "title": "User id of the blog creator is at the start sent along the request",
        "id": "69c333d17e41aff1b0dc1a3d"
      }
    ],
    "id": "69c3278153f22852f28b7859"
  }
]
```

Let's also add a suitable population of user information to blogs in the controllers/blogs.js file:

```js
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});
```

Now the user's information is added to the user field of note objects.

```json
[
  {
    "title": "First class tests",
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    "likes": 10,
    "id": "69c1c95d2be88c91698d0c50"
  },
  {
    "title": "React patterns",
    "author": "Michael Chan",
    "url": "https://reactpatterns.com/",
    "likes": 7,
    "id": "69c1c95d2be88c91698d0c51"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": {
      "username": "root",
      "name": "Superuser",
      "id": "69c3278153f22852f28b7859"
    },
    "id": "69c333547e41aff1b0dc1a31"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": {
      "username": "root",
      "name": "Superuser",
      "id": "69c3278153f22852f28b7859"
    },
    "id": "69c333647e41aff1b0dc1a35"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": {
      "username": "root",
      "name": "Superuser",
      "id": "69c3278153f22852f28b7859"
    },
    "id": "69c333687e41aff1b0dc1a39"
  },
  {
    "title": "User id of the blog creator is at the start sent along the request",
    "author": "Cristian Mamani Aguirre",
    "url": "https://fullstackopen.com/",
    "likes": 0,
    "user": {
      "username": "root",
      "name": "Superuser",
      "id": "69c3278153f22852f28b7859"
    },
    "id": "69c333d17e41aff1b0dc1a3d"
  }
]
```

It's important to understand that the database does not know that the ids stored in the user field of the blogs collection reference documents in the user collection.

The functionality of the populate method of Mongoose is based on the fact that we have defined "types" to the references in the Mongoose schema with the ref option:

```js
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // <--- This ref option
  },
});
```

## 4.16 Blog List Expansion, step 4

Add `minlength` and `required` to the username. You already have `unique: true`, which is perfect.

```js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3, // Validation for username length
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});
```

### Update the Users Controller

We must validate the password before calling `bcrypt.hash`. If validation fails, we return `400 Bad Request` and an error message.

File: `controllers/users.js`

```js
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

// Password validation (Requirement 4.16)
if (!password || password.length < 3) {
  return response.status(400).json({
    error: "password must be at least 3 characters long",
  });
}

// Username validation for presence (backup for the controller)
if (!username || username.length < 3) {
  return response.status(400).json({
    error: "username must be at least 3 characters long",
  });
}
//...
```

### Add Integration Tests

You need to verify that invalid users are rejected. Add these tests to your user test block.

File: tests/blog_api.test.js (or your user test file)

```js
describe("invalid user creation", () => {
  test("creation fails with 400 if password is too short", async () => {
    const newUser = {
      username: "shortpw",
      name: "Short Password Test",
      password: "12", // Less than 3 chars
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    );
  });

  test("creation fails with 400 if username is too short", async () => {
    const newUser = {
      username: "li", // Less than 3 chars
      name: "Short Username Test",
      password: "validpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("username must be at least 3 characters long"),
    );
  });
});
```

### Pro-tip for sequential tests

To avoid the database race conditions mentioned in the exercise, make sure your package.json test script looks like this:

```bash
"test": "node --test --test-concurrency=1"
```
