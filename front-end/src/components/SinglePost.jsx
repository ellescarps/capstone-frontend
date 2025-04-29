import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../API";

function SinglePost({ search }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user')) || null;

    async function fetchSinglePost(id) {
        try {
            const response = await fetch(`${API_URL}/posts/${id}`);
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchPost() {
            try {
                const singlePost = await fetchSinglePost(id);
                setPost(singlePost);
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Could not load post.");
            }
        }
        fetchPost();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!post) return <div>Loading...</div>;

    const highlightSearchTerm = (text) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
            ) : part
        );
    };

    const handleMessageClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/inbox?recipient=${post.user.username}`);
        }
    };

    return (
        <div className="home-background2">
        <div className="single-post-container">
            <div className="single-post">
                {/* Post Title */}
                <h1 className="post-title">{highlightSearchTerm(post.title)}</h1>
    
                {/* Post Image */}
                {post.images && post.images.length > 0 ? (
                    <div className="post-image-wrapper">
                        <img
                        className={`post-image ${imageLoaded ? 'loaded' : 'loading'}`}
                        src={post.images[0].url}
                        alt={post.title}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/earth.jpg';
                        }}
                        />
                    </div>
                ) : (
                    <p>No image available</p>
                )}
    
                {/* Post Description */}
                <p className="post-description">{highlightSearchTerm(post.description)}</p>
    
                {/* Post Details */}
                <div className="post-details">
                    <div className="post-meta">
                        <span className="category">{post.category?.name || "Unknown Category"}</span>
                        <span
                            className={`availability ${post.isAvailable ? "available" : "unavailable"}`}
                        >
                            {post.isAvailable ? "Available" : "Unavailable"}
                        </span>
                    </div>
    
                    <div className="location-date">
                        <span className="location">
                            {post.latitude && post.longitude
                                ? `📍 ${post.latitude}, ${post.longitude}`
                                : "📍 Location pending"}
                        </span>
                        {post.createdAt && (
                            <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        )}
                    </div>
    
                    <div className="shipping-info">
                        <p><strong>Shipping Option:</strong> ${post.shippingCost} ∨ {post.shippingOption}</p>
                        <p><strong>Shipping Responsibility:</strong> {post.shippingResponsibility}</p>
                    </div>
    
                    <div className="post-footer">
                    <div className="user-info">
                        <Link 
                            to={`/${post.user?.username || "unknown"}`} 
                            className="username"
                        >
                            {post.user?.name || "Unknown User"}
                        </Link>
                    </div>
                       


                        <div className="post-stats">
                            <span className="stat-item">🔥 {post.trendingScore}</span>
                            <span className="stat-item">💜 {post.likes.length}</span>
                            <span className="stat-item">✨ {post.favorites.length}</span>
                        </div>
                    </div>
                </div>
    
                <div className="message-button-wrapper">
                <div style={{ marginTop: "16px" }}>
                    <button onClick={handleMessageClick} className="message-button">
                        Message Me
                    </button>
                </div>
                </div>
            </div>
    
            {/* Comments Section */}
            <div className="comments-section">
                <h2>Comments</h2>
                {post.comments.length > 0 ? (
                    post.comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <p><strong>{comment.user?.name || "Anonymous"}:</strong> {comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
        </div>
    );
}    

export default SinglePost;
