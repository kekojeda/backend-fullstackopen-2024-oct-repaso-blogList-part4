const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('Most Blog', ()=>{
    test('The most author with blogs is', () => {
        const blogs = [
            { title: "Post 1", author: "Robert C. Martin", likes: 10 },
            { title: "Post 2", author: "Robert C. Martin", likes: 5 },
            { title: "Post 3", author: "Jane Doe", likes: 7 },
            { title: "Post 4", author: "Robert C. Martin", likes: 3 },
            { title: "Post 5", author: "Jane Doe", likes: 4 },
        ];
        
        const expected = { author: "Robert C. Martin", blogs: 3 };
      
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, expected)
      })
      test('returns null for an empty list', () => {
        const blogs = [];
        const result = listHelper.mostBlogs(blogs);
        assert.strictEqual(result, null);
    });
})