import React from "react";
import { Link } from "react-router-dom";

function PostCard({
    title,
    description,
    image,
    category,
    user,
    city,
    country,
    isAvailable,
    shippingCost,
    shippingResponsibility,
    shippingOption,
    isFeatured,
    trendingScore,
    createdAt,
    likesCount,
    commentsCount,
    favoritesCount,
    onClick,
}) {
    return (
        <div className="post-card" onClick={onClick}>
            <div className="post-image-wrapper">
                <img src={image} alt={`Image for ${title}`} className="post-image" />
                {isFeatured && <div className="featured-label">Featured</div>}
            </div>

            <div className="post-content">
                <h2 className="post-title">{title}</h2>
                <p className="post-description">{description}</p>

                <div className="post-meta">
                    <span className="category">{category}</span>
                    <span
                        className={`availability ${isAvailable ? "available" : "unavailable"}`}
                    >
                        {isAvailable ? "Available" : "Unavailable"}
                    </span>

                    <div className="location-date">
                        <span className="location">
                            {city && country ? `📍 ${city}, ${country}` : "📍 Location pending"}
                        </span>
                        {createdAt && (
                            <span className="date">{new Date(createdAt).toLocaleDateString()}</span>
                        )}
                    </div>
                </div>

                <div className="post-footer">
                    <div className="user-info">
                         <Link to={`/${user?.username || "unknown"}`} className="username">
                            {user?.username || "Unknown"}
                        </Link>
                    </div>
                    <div className="post-stats">
                        <span className="stat-item">💜 {likesCount || 0}</span>
                        <span className="stat-item">💬 {commentsCount || 0}</span>
                        <span className="stat-item">⭐ {favoritesCount || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostCard;
