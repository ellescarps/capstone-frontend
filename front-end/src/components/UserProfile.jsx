import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const defaultAvatar = 'https://via.placeholder.com/150';

function UserProfile() {
  const { username } = useParams(); 
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [callouts, setCallouts] = useState(null);
  const [collections, setCollections] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCallouts, setLoadingCallouts] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const token = localStorage.getItem('authToken'); 
  

  useEffect(() => {
    setUser(null);
    setUserNotFound(false);
    setPosts([]);
    setCollections([]);
    setCallouts(null);
    setActiveTab('posts');
    setLoadingUser(true);
    setLoadingPosts(true);
    setLoadingCollections(true);
    setLoadingCallouts(false);
  }, [username]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/username/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!res.ok) {
          setUserNotFound(true);
          throw new Error('User not found');
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setLoadingUser(false);
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [username, token]);

  useEffect(() => {
    if (userNotFound || !user) return;
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch(`/api/posts/users/${user.id}?type=post`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [userNotFound, user, token]);

  useEffect(() => {
    if (userNotFound || !user) return;
    const fetchCollections = async () => {
      try {
        setLoadingCollections(true);
        const res = await fetch(`/api/collections/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!res.ok) throw new Error('Failed to fetch collections');
        const data = await res.json();
        setCollections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCollections(false);
      }
    };

    fetchCollections();
  }, [userNotFound, user, token]);

  useEffect(() => {
    if (activeTab !== 'callouts' || userNotFound || !user) return;
    if (callouts !== null) return;

    const fetchCallouts = async () => {
      try {
        setLoadingCallouts(true);
        const res = await fetch(`/api/posts/users/${user.id}?type=callout`, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!res.ok) throw new Error('Failed to fetch callouts');
        const data = await res.json();
        setCallouts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCallouts(false);
      }
    };

    fetchCallouts();
  }, [activeTab, userNotFound, user, token, callouts]);

  if (loadingUser) return <div>Loading user...</div>;
  if (userNotFound || !user) return <div>User not found</div>;

  const renderPosts = () => {
    if (loadingPosts) return <div>Loading posts...</div>;
    if (posts.length === 0) return <div>No posts yet.</div>;
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    );
  };

  const renderCallouts = () => {
    if (loadingCallouts) return <div>Loading callouts...</div>;
    if (callouts && callouts.length === 0) return <div>No callouts yet.</div>;
    if (!callouts) return null;
    return (
      <ul>
        {callouts.map(callout => (
          <li key={callout.id}>{callout.title}</li>
        ))}
      </ul>
    );
  };

  const renderCollections = () => {
    if (loadingCollections) return <div>Loading collections...</div>;
    if (collections.length === 0) return <div>No collections yet.</div>;
    return (
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>{collection.name}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img
          src={user.profilePicture || defaultAvatar}
          alt={`${user.name}'s avatar`}
          onError={e => (e.target.src = defaultAvatar)}
        />
        <h2>{user.name}</h2>
        <p>@{user.username}</p>
        {user.bio && <p>{user.bio}</p>}
      </div>

      <div className="tabs">
        <button onClick={() => setActiveTab('posts')} disabled={activeTab === 'posts'}>
          Posts
        </button>
        <button onClick={() => setActiveTab('callouts')} disabled={activeTab === 'callouts'}>
          Callouts
        </button>
        <button onClick={() => setActiveTab('collections')} disabled={activeTab === 'collections'}>
          Collections
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'callouts' && renderCallouts()}
        {activeTab === 'collections' && renderCollections()}
      </div>
    </div>
  );
}

export default UserProfile;
