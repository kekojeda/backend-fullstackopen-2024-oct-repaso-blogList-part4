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

}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }