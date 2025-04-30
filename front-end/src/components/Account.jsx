import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from "./PostCard";
import CalloutCard from "./CalloutCard";
import CollectionCard from "./CollectionCard";
import { API_URL } from "../API"; 
import { AuthContext } from "./AuthContext";

function Account() {
    const { id } = useParams();  
    const [posts, setPosts] = useState([]);
    const [callouts, setCallouts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedTab, setSelectedTab] = useState('posts');  
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        city: '',
        country: '',
        bio: '',
        profilePicUrl: '',
    });
    const [editingCollectionId, setEditingCollectionId] = useState(null);
    const [newCollectionName, setNewCollectionName] = useState('');
    const navigate = useNavigate();
    
    const { user, setUser, loading, token } = useContext(AuthContext);  


    useEffect(() => {
        async function fetchData() {
          const res = await fetch(`/api/users/${id}`);
          const json = await res.json();
          console.log(json); 
          setPosts(json.posts || []);
          setCallouts(json.callouts || []);
          setCollections(json.collections || []);
        }
        fetchData();
      }, [id]);



    useEffect(() => {
        if (!id || !token || loading) {
            console.warn("ID, token, or loading state is missing. Skipping fetch.");
            return;
        }
    
        console.log(`Fetching data for user ${id}...`); 
    
        const controller = new AbortController();
        const signal = controller.signal;
    
        const fetchUserData = async () => {
            try {
                const [postsResponse, calloutsResponse, collectionsResponse] = await Promise.all([
                    fetch(`${API_URL}/posts/users/${id}?type=post`, { 
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        signal,
                    }),
                    fetch(`${API_URL}/posts/users/${id}?type=callout`, { 
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        signal,
                    }),
                    fetch(`${API_URL}/collections/users/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        signal,
                    }),
                ]);
    
              
                console.log('Posts response:', postsResponse);
                console.log('Callouts response:', calloutsResponse);
                console.log('Collections response:', collectionsResponse);
    
           
                if (postsResponse.ok) {
                    const postsData = await postsResponse.json();
                    console.log('Posts data:', postsData); 
                    setPosts(Array.isArray(postsData.data) ? postsData.data : []);
                } else {
                    const error = await postsResponse.json();
                    console.error("Posts fetch error:", error);
                }
    
             
                if (calloutsResponse.ok) {
                    const calloutsData = await calloutsResponse.json();
                    console.log('Callouts data:', calloutsData); 
                    setCallouts(Array.isArray(calloutsData.data) ? calloutsData.data : []);
                } else {
                    const error = await calloutsResponse.json();
                    console.error("Callouts fetch error:", error);
                }
    
            
                if (collectionsResponse.ok) {
                    const collectionsData = await collectionsResponse.json();
                    console.log('Collections data:', collectionsData); 
                    setCollections(Array.isArray(collectionsData) ? collectionsData : []);
                } else {
                    const error = await collectionsResponse.json();
                    console.error("Collections fetch error:", error);
                }
    
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Fetch error:", error);
                }
            }
        };
    
        fetchUserData();
        
        return () => controller.abort();
    }, [id, token, loading]);

    const handleEditProfile = () => {
        setEditForm({
            username: user.username,  
            city: user.city,
            country: user.country,
            bio: user.bio,
            profilePicUrl: user.profilePicUrl,
        });
        setShowEditModal(true);
    };

    const handleSaveProfile = async () => {
        console.log('Saving updated profile:', editForm);
        
        try {
            const response = await fetch(`${API_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editForm), 
            });
    
            if (response.ok) {
                const updatedUser = await response.json();

                setUser(updatedUser);
                setShowEditModal(false);  
                setEditForm({
                    username: updatedUser.username,  
                    city: updatedUser.city,
                    country: updatedUser.country,
                    bio: updatedUser.bio,
                    profilePicUrl: updatedUser.profilePicUrl,
                });
                alert('Profile updated successfully!');
            } else {
                const error = await response.json();
                console.error('Error saving profile:', error);
                alert('Error saving profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile');
        }
    };

    const handleDeleteItem = async (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
          try {
            const response = await fetch(`${API_URL}/${type}/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
      
            if (response.ok) {
              if (type === 'posts') setPosts(posts.filter(post => post.id !== id));
              if (type === 'callouts') setCallouts(callouts.filter(callout => callout.id !== id));
              if (type === 'collections') setCollections(collections.filter(collection => collection.id !== id));
              alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
            } else {
              const error = await response.json();
              console.error(`Failed to delete ${type}:`, error);
              alert(`Failed to delete ${type}.`);
            }
          } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert(`Error deleting ${type}.`);
          }
        }
      };
      

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleEditPost = (postId) => {
        navigate(`/edit-post/${postId}`);
};

const handleStartEdit = (collection) => {
    setEditingCollectionId(collection.id);
    setNewCollectionName(collection.name); 
};


const handleUpdateCollection = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(`/api/collections/${editingCollectionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCollectionName }),
        });

        if (res.ok) {
            setCollections(prevCollections => 
                prevCollections.map(collection => 
                    collection.id === editingCollectionId ? 
                    { ...collection, name: newCollectionName } : 
                    collection
                )
            );
            setEditingCollectionId(null);
            setNewCollectionName('');
        } else {
            console.error('Update failed');
        }
    } catch (err) {
        console.error(err);
    }
};


      

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="account-profile-container">
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Profile</h2>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            />
                        </label> <br />
                        <label>
                            City:
                            <input
                                type="text"
                                value={editForm.city}
                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                            />
                        </label> <br />
                        <label>
                            Country:
                            <input
                                type="text"
                                value={editForm.country}
                                onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                            />
                        </label> <br />
                        <label>
                            Bio:
                            <textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            />
                        </label> <br />
                        <label>
                            Profile Picture URL:
                            <input
                                type="text"
                                value={editForm.profilePicUrl}
                                onChange={(e) => setEditForm({ ...editForm, profilePicUrl: e.target.value })}
                            />
                        </label>
                        <div className="modal-actions">
                            <button onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button onClick={handleSaveProfile}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <section className="account-profile-header">
                <h1 className="account-about-me">{user.username}</h1>
                <img src={user.profilePicUrl} alt="Profile" />
                <p>{user.city}, {user.country}</p>
                <div className="account-about-me">
                    <h2>About Me</h2>
                    <p>{user.bio}</p>
                </div>
                <div className="account-profile-actions">
                    <button>⏯️</button>
                    <button>👥</button>
                    <button>↗️</button>
                </div>
            </section>

            {user.id === parseInt(id) && (
                <div className="account-edit-menu">
                    <button onClick={handleEditProfile}>Edit Profile</button>
                    <button onClick={() => handleTabChange('posts')}>Manage Posts</button>
                    <button onClick={() => handleTabChange('callouts')}>Manage Callouts</button>
                    <button onClick={() => handleTabChange('collections')}>Manage Collections</button>
                </div>
            )}

            <div className="account-tabs">
                <button
                    className={`account-tab ${selectedTab === 'posts' ? 'active' : ''}`}
                    onClick={() => handleTabChange('posts')}
                >POSTS</button>
                <button
                    className={`account-tab ${selectedTab === 'callouts' ? 'active' : ''}`}
                    onClick={() => handleTabChange('callouts')}
                >CALLOUTS</button>
                <button
                    className={`account-tab ${selectedTab === 'collections' ? 'active' : ''}`}
                    onClick={() => handleTabChange('collections')}
                >COLLECTIONS</button>
            </div>

            {selectedTab === 'posts' && (
                <section className="account-content active">
                    {/* <h2>Posts</h2> */}
                    <div className="account-posts-grid">
                        {posts.length ? posts.map(post => (
                            <div key={post.id} className="post-card">
                                <PostCard post={post} />
                                {user.id === parseInt(id) && (
                                    <div className="edit-delete-buttons">
                                        <button onClick={() => handleEditPost(post.id)}>Edit Post</button>
                                        <button onClick={() => handleDeleteItem(post.id, 'posts')}>Delete Post</button>
                                    </div>
                                    )}
                            </div>
                        )) : <p>No posts available</p>}
                    </div>
                </section>
            )}

            {selectedTab === 'callouts' && (
                <section className="account-content active">
                    {/* <h2>Callouts</h2> */}
                    <div className="account-callouts-grid">
                        {callouts.length ? callouts.map(callout => (
                            <div key={callout.id} className="callout-card">
                                <CalloutCard post={callout} />
                                {user.id === parseInt(id) && (
                                    <div className="edit-delete-buttons">
                                    <button onClick={() => handleEditPost(callout.id)}>Edit Post</button>
                                    <button onClick={() => handleDeleteItem(callout.id, 'callouts')}>Delete Callout</button>
                                    </div>
                                )}
                            </div>
                        )) : <p>No callouts available</p>}
                    </div>
                </section>
            )}

            

{selectedTab === 'collections' && (
    <section className="account-content active">
        <div className="account-collections-grid">
            {collections.length ? collections.map(collection => (
                <div key={collection.id} className="collection-card">
                    <CollectionCard collection={collection} />
                    {user.id === parseInt(id) && (
                        <div className="edit-delete-buttons">
                            {editingCollectionId === collection.id ? (
                                <form onSubmit={handleUpdateCollection} className="edit-collection-form">
                                    <input
                                        type="text"
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditingCollectionId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <button onClick={() => handleStartEdit(collection)}>Edit</button>
                                    <button onClick={() => handleDeleteItem(collection.id, 'collections')}>Delete</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )) : <p>No collections available</p>}
        </div>
    </section>
)}

        </div>
    );
}

export default Account;
