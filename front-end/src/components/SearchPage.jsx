import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../API';
import SearchIcon from '@mui/icons-material/Search';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    activeTab: 'users',
    loading: false,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchResults = async () => {
      if (query.length < 2) {
        setResults(prev => ({ ...prev, users: [], posts: [], loading: false }));
        return;
      }

      setResults(prev => ({ ...prev, loading: true, error: null }));

      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch(`${API_URL}/users?q=${query}`, { signal }),
          fetch(`${API_URL}/posts?q=${query}`, { signal })
        ]);

        if (!usersRes.ok || !postsRes.ok) {
          throw new Error('Failed to fetch search results');
        }

        const [users, posts] = await Promise.all([
          usersRes.json(),
          postsRes.json()
        ]);

        setResults({
          users,
          posts,
          activeTab: results.activeTab,
          loading: false,
          error: null
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setResults(prev => ({
            ...prev,
            loading: false,
            error: err.message
          }));
        }
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [query]);

  const handleTabChange = (tab) => {
    setResults(prev => ({ ...prev, activeTab: tab }));
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="search-input-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, posts..."
            autoFocus
          />
          {results.loading && <div className="spinner"></div>}
        </div>
      </div>

      <div className="search-tabs">
        <button
          className={`tab-button ${results.activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          People ({results.users.length})
        </button>
        <button
          className={`tab-button ${results.activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          Posts ({results.posts.length})
        </button>
      </div>

      <div className="search-results">
        {results.error ? (
          <div className="error-message">{results.error}</div>
        ) : results.activeTab === 'users' ? (
          results.users.length > 0 ? (
            results.users.map(user => (
              <Link 
              to={`/users/${user?.username}`}
              key={user.id} 
              className="result-card user-card"
            >
              <img 
                src={user.profilePicUrl || '/default-avatar.png'} 
                alt={user.username}
                className="user-avatar"
              />
              <div className="user-info">
                <h4>@{user.username}</h4>
                <p className="bio">{user.bio || 'No bio yet'}</p>
              </div>
            </Link>
            
            ))
          ) : (
            <div className="no-results">
              {query ? 'No users found' : 'Search for users by username or name'}
            </div>
          )
        ) : results.posts.length > 0 ? (
          results.posts.map(post => (
            <Link 
              to={`/posts/${post.id}`} 
              key={post.id} 
              className="result-card post-card"
            >
              <h4>{post.title}</h4>
              <p className="post-description">
                {post.description.substring(0, 100)}
                {post.description.length > 100 ? '...' : ''}
              </p>
              <div className="post-meta">
                <span className="category">{post.category?.name || 'General'}</span>
                <span className="date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            {query ? 'No posts found' : 'Search for posts by title or description'}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;