import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
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
    const [postType, setPostType] = useState('post'); 
    const [selectedTab, setSelectedTab] = useState('posts');  
    
    const { user, loading, token } = useContext(AuthContext);  
    console.log(token);
    useEffect(() => {
        if (!id || !token) {
            if (!loading) {
                console.warn("ID or token is missing. Skipping fetch.");
            }
            return;
        }

          const controller = new AbortController(); 
          const signal = controller.signal;  
      
        
  
        const fetchUserPosts = async () => {
            try {
            const response = await fetch(`${API_URL}/posts/users/${id}?type=${selectedTab}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                signal,
            });


            if (response.ok) {
                const json = await response.json();
                if (selectedTab === 'post') {
                    setPosts(json);
                } else {
                    setCallouts(json);
                }
            } else {
                const error = await response.json();
                console.error("Error fetching user posts:", error);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error in fetchUserPosts", error);
            }
        }
        };

        const fetchUserCollections = async () => {
            try{
            const response = await fetch(`${API_URL}/collections/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                signal,
            });


            if (response.ok) {
                const collectionsData = await response.json();
                setCollections(collectionsData);
            } else {
                console.log("Error fetching collections");
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error in fetchUserPosts", error);
            }
        }
        };

        fetchUserPosts();
        fetchUserCollections();

   
    return () => {
        controller.abort();  
    };

    }, [id, postType, selectedTab]); 


    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <div>
            <div className="profile-container">
            </div>

            <main>
                <section className="profile-header">
                    <h1>{user.username}</h1>
                    <img src={user.profilePicUrl} alt="Profile" />
                    <p>{user.city}, {user.country}</p>

                    <div className="about-me">
                        <h2>About Me</h2>
                        <p>{user.bio}</p>
                    </div>

                    <div className="profile-actions">
                        <button>Music</button>
                        <button>Follow</button>
                        <button>Share</button>
                    </div>
                </section>

                <div className="tabs">
                <button className="tab" onClick={() => setSelectedTab('posts')}>Posts</button>
                <button className="tab" onClick={() => setSelectedTab('callouts')}>Callouts</button>
                <button className="tab" onClick={() => setSelectedTab('collections')}>Collections</button>
                </div>

    
                    <section className={`content ${selectedTab === 'posts' ? 'active' : ''}`} id="postsContent">
                        <h2>Posts</h2>
                        <div className="posts-grid">
                        {posts.length > 0 ? (
                                    posts.map(post => (
                                        <PostCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <p>No posts available</p>
                                )}
                        </div>
                    </section>

                    <section className={`content ${selectedTab === 'callouts' ? 'active' : ''}`} id="calloutsContent">
                        <h2>Callouts</h2>
                        <div className="callouts-grid">
                        {callouts.length > 0 ? (
                                    callouts.map(callout => (
                                        <CalloutCard key={callout.id} callout={callout} />
                                    ))
                                ) : (
                                    <p>No callouts available</p>
                                )}
                        </div>
                    </section>

                        <section className={`content ${selectedTab === 'collections' ? 'active' : ''}`} id="collectionsContent">
                        <h2>Collections</h2>
                        <div className="collections-grid">
                        {collections.length > 0 ? (
                                    collections.map(collection => (
                                        <CollectionCard key={collection.id} collection={collection} />
                                    ))
                                ) : (
                                    <p>No collections available</p>
                                )}
                        </div>
                    </section>
            </main>
        </div>
    );
}

export default Account;
