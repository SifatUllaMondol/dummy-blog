const db = require('../config/database');

const Post = {
  // Get all posts
  async findAll() {
    const result = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM posts ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Get post by ID
  async findById(id) {
    const result = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM posts WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Create new post
  async create(title, content) {
    const result = await db.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at, updated_at',
      [title, content]
    );
    return result.rows[0];
  },

  // Update post
  async update(id, title, content) {
    const result = await db.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING id, title, content, created_at, updated_at',
      [title, content, id]
    );
    return result.rows[0];
  },

  // Delete post
  async delete(id) {
    const result = await db.query(
      'DELETE FROM posts WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = Post;