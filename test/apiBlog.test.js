const { test, after,beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const blogs = [
    {
        title: "Canonical string reduction",
        author: "Alan Turing",
        likes: 15
    },
    {
        title: "Data Compression Techniques",
        author: "Grace Hopper",
        likes: 8
    },
    {
        title: "Algorithmic Paradigms",
        author: "Donald Knuth",
        likes: 20
    },
    {
        title: "Programming and Philosophy",
        author: "Ada Lovelace",
        likes: 5
    }
];

beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = blogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

test('blogs are 4', async () => {
    const response = await api.get('/api/blogs')


    assert.strictEqual(response.body.length, blogs.length)
})

after(async () => {
  await mongoose.connection.close()
})