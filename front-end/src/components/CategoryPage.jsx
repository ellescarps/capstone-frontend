import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import CalloutCard from "./CalloutCard";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../API";

function CategoryPage({ search }) {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [callouts, setCallouts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('posts');

    useEffect(() => {
        const fetchPostsByCategory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/posts?category=${categoryName}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const json = await response.json();
                
                setPosts(json?.filter(post => post?.type === 'post') || []);
                setCallouts(json?.filter(post => post?.type === 'callout') || []);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPostsByCategory();
    }, [categoryName]);

    const filteredPosts = posts?.filter(post => {
        if (!search) return true;
        return (
            post?.title?.toLowerCase().includes(search.toLowerCase()) ||
            post?.description?.toLowerCase().includes(search.toLowerCase())
        );
    }) || [];

    const filteredCallouts = callouts?.filter(callout => {
        if (!search) return true;
        return (
            callout?.title?.toLowerCase().includes(search.toLowerCase()) ||
            callout?.description?.toLowerCase().includes(search.toLowerCase())
        );
    }) || [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="category-page">
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


            <div className="category-posts">
                {selectedTab === 'posts' && (
                    <div className="posts-grid">
                        {filteredPosts?.length > 0 ? (
                            filteredPosts.map(post => (
                                <PostCard
                                    key={post?.id}
                                    title={post?.title || 'Untitled Post'}
                                    description={post?.description || 'No description'}
                                    image={post?.images?.[0]?.url || ''}
                                    category={post?.category?.name || 'Uncategorized'}
                                    user={post?.user?.username || 'Anonymous'}
                                    city={post?.city || ''}
                                    country={post?.country || ''}
                                    isAvailable={post?.isAvailable ?? true}
                                    shippingCost={post?.shippingCost || 0}
                                    shippingResponsibility={post?.shippingResponsibility || 'UNKNOWN'}
                                    shippingOption={post?.shippingOption || 'UNKNOWN'}
                                    isFeatured={post?.isFeatured || false}
                                    trendingScore={post?.trendingScore || 0}
                                    createdAt={post?.createdAt || new Date().toISOString()}
                                    likesCount={post?.likes?.length || 0}
                                    commentsCount={post?.comments?.length || 0}
                                    favoritesCount={post?.favorites?.length || 0}
                                    onClick={() => navigate(`/posts/${post?.id}`)}
                                />
                            ))
                        ) : (
                            <p className="no-posts">No posts found in this category.</p>
                        )}
                    </div>
                )}

                {selectedTab === 'callouts' && (
                    <div className="callouts-grid">
                        {filteredCallouts?.length > 0 ? (
                            filteredCallouts.map(callout => (
                                <CalloutCard
                                    key={callout?.id}
                                    post={callout || {}}
                                />
                            ))
                        ) : (
                            <p className="no-posts">No callouts found in this category.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;