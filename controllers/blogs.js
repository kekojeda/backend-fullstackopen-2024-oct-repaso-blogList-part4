const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
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

  // Verificación de campos requeridos (title y url)
  if (!title || !url) {
      return response.status(400).json({ error: 'title or url missing' });
  }

  try {
      const blog = new Blog({
          title,
          url,
          author,
          likes: likes || 0  // Asignar 0 si 'likes' no está presente
      });

      const savedBlog = await blog.save();
      response.status(201).json(savedBlog);
  } catch (error) {
      response.status(500).json({ error: 'Failed to save blog' });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
      const blog = await Blog.findByIdAndDelete(request.params.id)
      if (blog) {
          response.status(204).end()
      } else {
          response.status(404).json({ error: 'Blog not found' })
      }
  } catch (error) {
      response.status(400).json({ error: 'Malformatted id' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  try {
      const updatedBlog = await Blog.findByIdAndUpdate(
          request.params.id,
          { likes },
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


// notesRouter.delete('/:id', (request, response, next) => {
//   Blog.findByIdAndDelete(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// blogsRouter.put('/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Blog.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })

module.exports = blogsRouter