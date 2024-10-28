const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', ()=>{
    test('of empty list is 0', () => {
        const blogs = []
      
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 0)
      })

      test('when list has only one blogs equals the likes of that' , ()=>{
        const blogs=[{
            "title": "titulo blog",
            "author": "autor",
             "url": "wqeqeqwe.com",
             "likes": 22
        }]
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 22)
      })

      test('of a bigger list is calculates rigth', ()=>{
        const blogs=[
            {
            "title": "titulo blog",
            "author": "autor",
             "url": "wqeqeqwe.com",
             "likes": 22
        },
        {
            "title": "titulo blog",
            "author": "autor",
             "url": "wqeqeqwe.com",
             "likes": 22
        },
        {
            "title": "titulo blog",
            "author": "autor",
             "url": "wqeqeqwe.com",
             "likes": 1
        },

    ]
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 45)
      })

})

