const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('Favorite Blog', ()=>{
    test('The most favorite Blog is', () => {
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
        
        const favoriteBlog = 
        {
            title: "Algorithmic Paradigms",
            author: "Donald Knuth",
            likes: 20
        }
      
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, favoriteBlog)
      })
})

