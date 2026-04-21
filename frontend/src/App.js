import { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/posts/${editingId}` : `${API_URL}/posts`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save post');
      }

      await fetchPosts();
      setTitle('');
      setContent('');
      setEditingId(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
    setIsEditing(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete post');
      }

      await fetchPosts();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>My Blog</h1>
      </header>

      <main className="main">
        {error && <div className="error-message">{error}</div>}

        <section className="form-section">
          <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter post content"
                rows="5"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update' : 'Create'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="posts-section">
          <h2>All Posts</h2>
          {loading ? (
            <p className="loading">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="no-posts">No posts yet. Create your first post!</p>
          ) : (
            <div className="posts-list">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <div className="post-meta">
                    <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="btn btn-edit" 
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-delete" 
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
