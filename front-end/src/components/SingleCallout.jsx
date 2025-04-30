import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../API";

function SingleCallout({ search }) {
    const { id } = useParams();
    const [callout, setCallout] = useState(null);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user')) || null;

    async function fetchSingleCallout(id) {
        try {
            const response = await fetch(`${API_URL}/posts/${id}`);
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchCallout() {
            try {
                const singleCallout = await fetchSingleCallout(id);
                if (singleCallout.type !== "callout") {
                    setError("This is not a valid callout.");
                } else {
                    setCallout(singleCallout);
                }
            } catch (error) {
                console.error("Error fetching callout:", error);
                setError("Could not load callout.");
            }
        }
        fetchCallout();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!callout) return <div>Loading...</div>;

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
            navigate(`/inbox?recipient=${callout.user.username}`);
        }
    };

    return (
        <div className="home-background2">
            <div className="single-post-container">
                <div className="single-post">
                    <h1 className="post-title">{highlightSearchTerm(callout.title)}</h1>

                    {callout.images && callout.images.length > 0 ? (
                        <div className="post-image-wrapper">
                            <img
                                className={`post-image ${imageLoaded ? 'loaded' : 'loading'}`}
                                src={callout.images[0].url}
                                alt={callout.title}
                                onLoad={() => setImageLoaded(true)}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default.jpg';
                                }}
                            />
                        </div>
                    ) : (
                        <p>No image available</p>
                    )}

                    <p className="post-description">{highlightSearchTerm(callout.description)}</p>

                    <div className="post-details">
                        <div className="post-meta">
                            <span className="category">{callout.category?.name || "Unknown Category"}</span>
                            <span className={`availability ${callout.isAvailable ? "available" : "unavailable"}`}>
                                {callout.isAvailable ? "Available" : "Unavailable"}
                            </span>
                        </div>

                        <div className="location-date">
                            <span className="location">
                                {callout.latitude && callout.longitude
                                    ? `📍 ${callout.latitude}, ${callout.longitude}`
                                    : "📍 Location pending"}
                            </span>
                            {callout.createdAt && (
                                <span className="date">{new Date(callout.createdAt).toLocaleDateString()}</span>
                            )}
                        </div>

                        <div className="shipping-info">
                            <p><strong>Shipping Option:</strong> ${callout.shippingCost} ∨ {callout.shippingOption}</p>
                            <p><strong>Shipping Responsibility:</strong> {callout.shippingResponsibility}</p>
                        </div>

                        <div className="post-footer">
                            <div className="user-info">
                                <Link
                                    to={`/${callout.user?.username || "unknown"}`}
                                    className="username"
                                >
                                    {callout.user?.name || "Unknown User"}
                                </Link>
                            </div>

                            <div className="post-stats">
                                <span className="stat-item">🔥 {callout.trendingScore}</span>
                                <span className="stat-item">💜 {callout.likes.length}</span>
                                <span className="stat-item">✨ {callout.favorites.length}</span>
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

                <div className="comments-section">
                    <h2>Comments</h2>
                    {callout.comments.length > 0 ? (
                        callout.comments.map(comment => (
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

export default SingleCallout;
