const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    { title: "Canonical string reduction", author: "Alan Turing", likes: 15, url: "http://example.com/1" },
    { title: "Data Compression Techniques", author: "Grace Hopper", likes: 8, url: "http://example.com/2" },
    { title: "Algorithmic Paradigms", author: "Donald Knuth", likes: 20, url: "http://example.com/3" },
    { title: "Programming and Philosophy", author: "Ada Lovelace", likes: 5, url: "http://example.com/4" }
];

describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initialBlogs)
    })

    describe('retrieving blogs', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('all blogs are returned', async () => {
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, initialBlogs.length)
        })

        test('blogs have id property', async () => {
            const response = await api.get('/api/blogs')
            response.body.forEach(blog => {
                assert.ok(blog.id)
                assert.strictEqual(blog._id, undefined)
            })
        })
    })

    describe('viewing a specific blog', () => {
        test('succeeds with a valid id', async () => {
            const blogsAtStart = await Blog.find({})
            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(resultBlog.body.title, blogToView.title)
            assert.strictEqual(resultBlog.body.author, blogToView.author)
        })

        test('fails with status code 404 if blog does not exist', async () => {
            const validNonexistentId = new mongoose.Types.ObjectId()
            await api.get(`/api/blogs/${validNonexistentId}`).expect(404)
        })

        test('fails with status code 400 if id is invalid', async () => {
            const invalidId = '12345invalidid'
            await api.get(`/api/blogs/${invalidId}`).expect(400)
        })
    })

    describe('adding a new blog', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: "New Testing Blog",
                author: "Test Author",
                url: "http://example.com/new-testing-blog",
                likes: 10
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert(titles.includes(newBlog.title))
        })

        test('sets likes to 0 if likes property is missing', async () => {
            const newBlog = {
                title: "Blog without likes",
                author: "Author without likes",
                url: "http://example.com/blog-without-likes"
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('fails with status code 400 if title or url is missing', async () => {
            const blogWithoutTitle = { author: "Author without title", url: "http://example.com" }
            const blogWithoutUrl = { title: "Title without url", author: "Author without url" }

            await api.post('/api/blogs').send(blogWithoutTitle).expect(400)
            await api.post('/api/blogs').send(blogWithoutUrl).expect(400)
        })
    })

    describe('deleting a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await Blog.find({})
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes(blogToDelete.title))
        })

        test('fails with status code 404 if blog does not exist', async () => {
            const validNonexistentId = new mongoose.Types.ObjectId()
            await api.delete(`/api/blogs/${validNonexistentId}`).expect(404)
        })

        test('fails with status code 400 if id is invalid', async () => {
            const invalidId = '12345invalidid'
            await api.delete(`/api/blogs/${invalidId}`).expect(400)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
