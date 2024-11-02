const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    { title: "Canonical string reduction", author: "Alan Turing", likes: 15, url: "http://example.com/1" },
    { title: "Data Compression Techniques", author: "Grace Hopper", likes: 8, url: "http://example.com/2" }
]

describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initialBlogs)
    })

    describe('updating a blog', () => {
        test('succeeds in updating likes with a valid id', async () => {
            const blogsAtStart = await Blog.find({})
            const blogToUpdate = blogsAtStart[0]
            const newLikes = blogToUpdate.likes + 1

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({ likes: newLikes })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const updatedBlog = response.body
            assert.strictEqual(updatedBlog.likes, newLikes)
        })

        test('fails with status code 404 if blog does not exist', async () => {
            const validNonexistentId = new mongoose.Types.ObjectId()
            await api
                .put(`/api/blogs/${validNonexistentId}`)
                .send({ likes: 20 })
                .expect(404)
        })

        test('fails with status code 400 if id is invalid', async () => {
            const invalidId = '12345invalidid'
            await api
                .put(`/api/blogs/${invalidId}`)
                .send({ likes: 20 })
                .expect(400)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
