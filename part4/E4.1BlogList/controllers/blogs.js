const blogsRouter = require("express").Router();

const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 }); // Creator info displayed with blog

  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  }); // Consistent with the GET all route;

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json({ error: "no users found in database" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id, // Assign the ID of the found user
  });

  const savedBlog = await blog.save();

  // Link the blog back to the user's array
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  // 1. Extract and verify token
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  // 2. Find the blog to check ownership
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    // If the blog doesn't exist, we can return 204 or 404
    return response.status(404).json({ error: "blog not found" });
  }

  // 3. Compare IDs (Using the .toString() method mentioned in the task)
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({
      error: "only the creator can delete this blog",
    });
  }

  // 4. If everything is correct, proceed with deletion
  await Blog.findByIdAndDelete(request.params.id);
  // REST convention: 204 No Content for successful deletion
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    returnDocument: "after",
    runValidators: true,
  });

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogsRouter;
