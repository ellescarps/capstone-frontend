import React from "react";
import { Link } from "react-router-dom";

function CalloutCard({ post, user, onClick }) {
    
    return (
        <div className="callout-card" onClick={onClick}>
            <div className="callout-details">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <div className="callout-footer">
                    <span className="callout-category">{post.category?.name || "General"}</span>
                    <div className="user-info">
                            <Link to={`/users/${user?.username}`} className="username">
                                @{user?.username || "Unknown"}
                            </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CalloutCard;
