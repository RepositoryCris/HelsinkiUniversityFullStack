//imports
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

//middlewares
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

app.use(express.json());

//mongo db
const mongoUrl = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003;

console.log("connecting to", mongoUrl);
mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

//routes
app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
