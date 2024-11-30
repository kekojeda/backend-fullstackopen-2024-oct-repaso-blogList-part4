const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


blogsRouter.post('/', async (request, response) => {
  const { title, url, author, likes } = request.body;
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)


  // Verificación de campos requeridos (title y url)
  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  try {
    const blog = new Blog({
      title,
      url,
      author,
      likes: likes || 0, // Asignar 0 si 'likes' no está presente
      user: user.id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog);

  } catch (error) {
    response.status(500).json({ error: 'Failed to save blog' });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token inválido o faltante' });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog no encontrado' });
  }

  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'No estás autorizado para eliminar este blog' });
  }

  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: 'ID malformado' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const { user, likes, author, title, url } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { user, likes, author, title, url },
      { new: true, runValidators: true }
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    response.status(400).json({ error: 'Malformatted id' })
  }
})




module.exports = blogsRouter