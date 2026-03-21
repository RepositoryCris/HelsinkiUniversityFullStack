const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogList) => {
  const reduce = (accumulator, item) => {
    return accumulator + item.likes;
  };

  return blogList.length === 0 ? 0 : blogList.reduce(reduce, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
