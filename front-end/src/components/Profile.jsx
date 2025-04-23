import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import PostCard from "./PostCard";
import CalloutCard from "./CalloutCard";
import SideBar from "./Sidebar";
import CollectionCard from "./CollectionCard";
import { API_URL } from "../API";


function ProfilePage() {
    const {id} = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [callouts, setCallouts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [error, setError] = useState(null);
    const [following, setFollowing] = useState(false);


useEffect( () => {
    async function checkFollowStatus() {
        try {
            const response = await fetch(`${API_URL}/following`);
            const following = await response.json();

            const isFollowing = following.some((follow) => follow.id === parseInt(id));
            setFollowing(isFollowing);
        } catch (error) {
            console.error(error);
        }
    }
    checkFollowStatus();
}, [id]);

async function handleFollow() {
    try {
        const response = await fetch(`${API_URL}/follow/${id}`, {
            method: "POST",
        });

        if (response.ok) {
            setFollowing(true);
        } else {
            console.error("Failed to follow user")
        }
    } catch (error) {
        console.error(error);
    }
}

async function handleUnfollow() {
    try {
        const response = await fetch(`${API_URL}/unfollow/${id}`, {
            method: "DELETE",
         });

        if (response.ok) {
            setFollowing(false);
        }  else {
            console.error("Failed to unfollow user")
        }
    } catch (error) {
        console.error("Error following user", error);
    }
}



    useEffect(() => {
        async function fetchProfileAndPosts() {
            try {
                const response = await fetch(`${API_URL}/user/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile, status: ${response.status}`);
                }
                const json = await response.json();
                setProfile(json);
    
                const postsResponse = await fetch(`${API_URL}/user/${id}/posts`);
                if (!postsResponse.ok) {
                    throw new Error(`Failed to fetch posts, status: ${postsResponse.status}`);
                }
                const postsData = await postsResponse.json();
    
                console.log("Fetched posts data:", postsData);
    
                setPosts(postsData.filter(post => post.type === 'post'));
                setCallouts(postsData.filter(post => post.type === "callout"));
    
               
                const collectionsResponse = await fetch(`${API_URL}/collections`);
                if (!collectionsResponse.ok) {
                    throw new Error(`Failed to fetch collections, status: ${collectionsResponse.status}`);
                }
                const collectionsData = await collectionsResponse.json();
                setCollections(collectionsData);
    
            } catch (error) {
                console.error("Error during fetch:", error);
                setError("Failed to load");
            }
        }
        fetchProfileAndPosts();
    }, [id]);

if (error) return <div>{error}</div>

if (!profile || !posts || !callouts || !collections) {
    return <p>Loading profile...</p>;
  }

    return (
        <div>
            <div className="profile-container">
            </div>

            <main>
                {profile && (
                    <section className="profile-header">
                        <h1>{profile.name}</h1>
                        <img src={profile.profilePicUrl} alt={`${profile.name}'s profile`} />
                        <p>{profile.location.city}, {profile.location.country.name}</p>

                        <div className="about-me">
                         <h2>About Me</h2>
                         <p>I'm passionate about creating community.
                         Check out my 
                         <a href="https://soundcloud.com/yourmusic" target="_blank" rel="noopener noreferrer">music</a>, 
                        <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer"> Instagram</a>, 
                        and <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">site</a>.
                        </p>
                        </div>

                        <div className="profile-actions">
                        <button>Music</button>

                        {isFollowing ? (
                            <button onClick={handleUnfollow}>Unfollow</button>
                        ) : (
                            <button onClick={handleFollow}>Follow</button>
                        )}
                        
                        
                        <button>Share</button>
                        </div>

                    </section>
                )}

                <div className="content-columns">
                    <section>
                        <h2>Posts</h2>
                        <div className="posts-grid">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        </div>
                    </section>

                    <section>
                        <h2>Callouts</h2>
                        <div className="callouts-grid">
                            {callouts.map(callout => (
                                <CalloutCard key={callout.id} post={callout}/>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2>Collections</h2>
                        <div className="collections-grid">
                            {collections.map(collection => (
                                <CollectionCard key={collection.id} collection={collection}/>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

          
        </div>
            
    )
}

export default ProfilePage



          




      