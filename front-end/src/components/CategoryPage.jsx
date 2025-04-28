import React, {useState, useEffect} from "react";
import PostCard from "./PostCard";
import CalloutCard from "./CalloutCard";
import { useParams } from "react-router-dom";
import { API_URL } from "../API";

function CategoryPage( {search} ) {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [callouts, setCallouts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('posts'); 


    useEffect( () => {
        const fetchPostsByCategory = async () => {
            try {
                console.log(`Fetching posts for category: ${categoryName}`);
                const response = await fetch(`${API_URL}/posts?category=${categoryName}`);
                const json = await response.json();
                console.log("Fetched posts and callouts:", json);

            
                const filteredPosts = json.filter(post => post.type === 'post');
                const filteredCallouts = json.filter(post => post.type === 'callout');

                setPosts(filteredPosts);
                setCallouts(filteredCallouts);
            } catch (error) {
                setError("Error fetching posts");
            }
        }
        fetchPostsByCategory();
    }, [categoryName]);


   const filteredPosts = posts.filter(post => {
    if (!search) return true;
    return post.title.toLowerCase().includes(search.toLowerCase()) ||
           post.description.toLowerCase().includes(search.toLowerCase());
});

const filteredCallouts = callouts.filter(callout => {
    if (!search) return true;
    return callout.title.toLowerCase().includes(search.toLowerCase()) ||
           callout.description.toLowerCase().includes(search.toLowerCase());
});


if (error) return <div>{error}</div>;

return (
    <div className="category-page">
        <h1>Category: {categoryName}</h1>

        {/* 🔥 Tab Buttons */}
        <div className="tab-buttons">
                <button
                    className={selectedTab === 'posts' ? 'active' : ''}
                    onClick={() => setSelectedTab('posts')}
                >
                    POSTS
                </button>

                <button
                    className={selectedTab === 'callouts' ? 'active' : ''}
                    onClick={() => setSelectedTab('callouts')}
                >
                    CALLOUTS
                </button>
            </div>


     {/* Display filtered posts or callouts based on the selected tab */}
            <div className="category-posts">
                {selectedTab === 'posts' && (
                    <div className="posts-grid">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <PostCard
                                key={post.id}
                                title={post.title}
                                description={post.description}
                                image={post.images[0]?.url}
                                category={post.category.name}
                                user={post.user.username}
                                city={post.city}
                                country={post.country}
                                isAvailable={post.isAvailable}
                                shippingCost={post.shippingCost}
                                shippingResponsibility={post.shippingResponsibility}
                                shippingOption={post.shippingOption}
                                isFeatured={post.isFeatured}
                                trendingScore={post.trendingScore}
                                createdAt={post.createdAt}
                                likesCount={post.likes.length}
                                commentsCount={post.comments.length}
                                favoritesCount={post.favorites.length}
                                onClick={() => navigate(`/posts/${post.id}`)}
                                />
                            ))
                        ) : (
                            <p>No posts found in this category.</p>
                        )}
                    </div>
                )}

                {selectedTab === 'callouts' && (
                    <div className="callouts-grid">
                        {filteredCallouts.length > 0 ? (
                            filteredCallouts.map(callout => (
                                <CalloutCard
                                    key={callout.id}
                                    post={callout}
                                />
                            ))
                        ) : (
                            <p>No callouts found in this category.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage