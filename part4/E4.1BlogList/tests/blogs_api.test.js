const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((e) => e.title);
  assert(titles.includes("React patterns"));
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "async/await functions",
    author: "Cristian Mamani Aguirre Junior Developer",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
    likes: 7,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);

  assert(titles.includes("async/await functions"));
});

test("blog without title or url is not added", async () => {
  const newBlogNoTitle = {
    author: "Cristian Mamani Aguirre",
    url: "https://fullstackopen.com/",
    likes: 5,
  };

  const newBlogNoUrl = {
    title: "Testing missing URL",
    author: "Cristian Aguirre",
    likes: 5,
  };

  // Test missing title
  await api.post("/api/blogs").send(newBlogNoTitle).expect(400);

  // Test missing url
  await api.post("/api/blogs").send(newBlogNoUrl).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.deepStrictEqual(resultBlog.body, blogToView);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  const ids = blogsAtEnd.map((b) => b.id);
  assert(!ids.includes(blogToDelete.id));

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test("unique identifier property is named id", async () => {
  const response = await api.get("/api/blogs");

  // Check the first blog in the response
  const blogToDiagnostics = response.body[0];

  assert.ok(blogToDiagnostics.id);
  assert.strictEqual(typeof blogToDiagnostics._id, "undefined");
  assert.strictEqual(typeof blogToDiagnostics.__v, "undefined");
});

test("if the likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Testing default likes",
    author: "Cristian Mamani Aguirre",
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

after(async () => {
  await mongoose.connection.close();
});
