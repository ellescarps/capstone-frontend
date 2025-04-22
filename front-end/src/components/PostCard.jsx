import React from "react";


function PostCard({
        title,
        description,
        image,
        category,
        user,
        location,
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
    <div>
        <div className="post-card" onClick={onClick}>
        {isFeatured && <div className="featured">Featured</div>}
        <img src={image} alt="image of post" />

        <div className="post-content">
        <h2 className="post-title">{title}</h2>
        <p className="post-description">{description}</p>

        <div className="post-meta">
            <span className="category">{category}</span>
            <span className="location">{location}</span>
            <span className={`availability ${isAvailable ? 'available' : 'unavailable'}`}>
                {isAvailable ? "Available" : "Unavailable"}
            </span>
        </div>

    <div className="post-footer">
        <span className="user">Posted by {user}</span>
        <span className="time">{new Date(createdAt).toLocaleDateString()}</span>
    </div>

    <div className="post-stats">
        <span> 💜 {likesCount}</span>
        <span> ✨ {favoritesCount}</span>
        <span> {commentsCount} </span>
        {trendingScore > 0 && <span>🔥 {trendingScore}</span>}
    </div>

        </div>
        </div>
    </div>
);

}



export default PostCard