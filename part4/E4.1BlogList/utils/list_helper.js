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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
