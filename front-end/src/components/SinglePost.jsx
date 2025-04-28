import React, { useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../API";

function SinglePost( {search} ) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


async function fetchSinglePost(id) {
    try {
        const response = await fetch(`${API_URL}/posts/${id}`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}

useEffect( () => {
   async function fetchPost() {
    try {
       const singlePost = await fetchSinglePost(id);
       setPost(singlePost);
    } catch (error) {
        console.error("Error fetching post:", error)
        setError("Could not load post.");
    }
   } fetchPost();
}, [id]);


if (error) return <div>{error}</div>
if (!post) return <div>Loading...</div>   

const highlightSearchTerm = (text) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
        ) : part
    );
};

return(
    <div>
        <div className="single-post">
         <h1>{highlightSearchTerm(post.title)}</h1>

         {post.images && post.images.length > 0 ? (
                <img src={post.images[0].url} alt={post.title} />
                ) : (
                <p>No image available</p>
         )}

         <p>{highlightSearchTerm(post.description)}</p>
        </div>

    <div className="post-details">
    <p><strong>Category:</strong> {post.category.name  || "Unknown Category"} </p>
    <p><strong>Posted by:</strong> {post.user.name} </p>
    <p><strong>Location:</strong> {post.latitude}, {post.longitude}</p>
    <p><strong>Shipping:</strong> ${post.shippingCost} - {post.shippingOption}</p>
    <p><strong>Responsibility:</strong> {post.shippingResponsibility} </p>
    <p><strong>Availability:</strong> {post.isAvailable ? "Available" : "Unavailable"} </p>
    <p><strong>Trending:</strong> 🔥 {post.trendingScore} </p>
    <p><strong>Likes:</strong> 💜 {post.likes.length}</p>
    <p><strong>Favorites</strong>✨ {post.favorites.length}</p>
    <p><strong>Comments:</strong>{post.comments.length}</p>
    </div>

    <div className="comments-section">
    <h2>Comments</h2>
    {post.comments.length > 0 ? (
    post.comments.map(comment => (
        <div key={comment.id}>
            <p><strong>{comment.user?.name || "Anonymous"}:</strong> {comment.content}</p>
        </div> 
        )) 
        ) : (
        <p>No comments yet.</p>
    )}
    </div>

    </div>
);
}

export default SinglePost