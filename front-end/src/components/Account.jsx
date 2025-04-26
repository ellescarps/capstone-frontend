import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import PostCard from "./PostCard";
import CalloutCard from "./CalloutCard";
import CollectionCard from "./CollectionCard";
import { API_URL } from "../API";  // Ensure this is the correct path to your API
import { AuthContext } from "./AuthContext";

function Account() {
    const { id } = useParams();  // Get the user's ID from the URL params
    const [posts, setPosts] = useState([]);
    const [callouts, setCallouts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [postType, setPostType] = useState('post'); // Default to 'post'

    const { user, loading, token } = useContext(AuthContext);  // Get the token from context

    useEffect(() => {
        if (!id || !token) {
            console.warn("ID or token is missing. Skipping fetch.");
            return;
          }

          const controller = new AbortController();  // Create an abort controller
          const signal = controller.signal;  // Get signal to pass to fetch
      
        
        // Fetch posts or callouts based on the selected type
        const fetchUserPosts = async () => {
            try {
            const response = await fetch(`${API_URL}/posts/users/${id}?type=${postType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Include token in headers
                },
                signal,
            });


            if (response.ok) {
                const data = await response.json();
                if (postType === 'post') {
                    setPosts(data);
                } else {
                    setCallouts(data);
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
                    'Authorization': `Bearer ${token}`  // Include token in headers
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

    // Cleanup on component unmount
    return () => {
        controller.abort();  // Abort fetch on cleanup
    };

    }, [id, postType, token]);  // Only re-run the effect when the user ID changes

    // Handle loading and display user information
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

                <div className="content-columns">
                    <section>
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

                    <section>
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

                    <section>
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
                </div>
            </main>
        </div>
    );
}

export default Account;
