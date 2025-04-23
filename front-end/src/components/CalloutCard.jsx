import React from "react";

function CalloutCard( {post} ) {
    return(
        <div className="callout-card">
            <h3>{post.title}</h3>
            <img src={post.images[0]?.url} alt={post.title} className="callout-image" />
            <p>{post.description}</p>

            <div className="callout-details">
                <span>{post.category.name}</span>
                <span>{post.location.city}</span>
            </div>
        </div>
    );
}

export default CalloutCard