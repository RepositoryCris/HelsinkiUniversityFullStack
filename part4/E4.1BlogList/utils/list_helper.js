const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogList) => {
  const reduce = (accumulator, item) => {
    return accumulator + item.likes;
  };

  return blogList.length === 0 ? 0 : blogList.reduce(reduce, 0);
};

const favoriteBlog = (blogList) => {
  if (blogList.length === 0) return null;

  const favorite = blogList.reduce((currentFavorite, nextBlog) => {
    return nextBlog.likes > currentFavorite.likes ? nextBlog : currentFavorite;
  });

  // The specific format of the exercise
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

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

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  return _.chain(blogs)
    .groupBy("author") // 1. Group by author: { "Dijkstra": [{likes: 5}, {likes: 12}], ... }
    .map((authorBlogs, authorName) => ({
      author: authorName,
      likes: _.sumBy(authorBlogs, "likes"), // 2. Sum the likes for this specific author
    }))
    .maxBy("likes") // 3. Find the object with the most total likes
    .value();
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
