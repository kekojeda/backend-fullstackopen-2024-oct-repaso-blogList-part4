const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const blogLikes = blogs.map(blog=>blog.likes)

    return blogLikes.reduce((acc, sum)=>acc + sum, 0)
}

const favoriteBlog = (blogs) => {
    const blogLikes = blogs.map(blog=>blog.likes)

    const indexBlogMostLike = blogLikes.indexOf(Math.max(...blogLikes)) 

    return blogs[indexBlogMostLike]
}

// usando Lodash 
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

   // Agrupa blogs por autor y cuenta el número de blogs por autor
   const authorCounts = _.countBy(blogs, 'author');

   // Encuentra el autor con la mayor cantidad de blogs
   const topAuthor = _.maxBy(Object.keys(authorCounts), author => authorCounts[author]);

   return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
};

}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  // Agrupa blogs por autor y suma los likes de cada autor
  const likesByAuthor = _(blogs)
      .groupBy('author')
      .map((authorBlogs, author) => ({
          author,
          likes: _.sumBy(authorBlogs, 'likes')
      }))
      .maxBy('likes'); // Encuentra el autor con el mayor número de likes

  return likesByAuthor;
};
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }