const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('mostLikes', () => {
    test('returns the author with the most total likes', () => {
        const blogs = [
            { title: "Post 1", author: "Edsger W. Dijkstra", likes: 5 },
            { title: "Post 2", author: "Robert C. Martin", likes: 3 },
            { title: "Post 3", author: "Edsger W. Dijkstra", likes: 12 },
            { title: "Post 4", author: "Jane Doe", likes: 4 },
            { title: "Post 5", author: "Robert C. Martin", likes: 8 },
        ];

        const expected = { author: "Edsger W. Dijkstra", likes: 17 };

        const result = listHelper.mostLikes(blogs);
        assert.deepStrictEqual(result, expected);
    });

    test('returns null for an empty list', () => {
        const blogs = [];
        const result = listHelper.mostLikes(blogs);
        assert.strictEqual(result, null);
    });
});
