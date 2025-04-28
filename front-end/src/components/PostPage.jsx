import React, { useEffect, useState} from "react";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../API";

function PostPage( {search} ) {
const [posts, setPosts] = useState([]);
const navigate = useNavigate();

useEffect( () => {
    async function fetchPosts() {
        try {
            const response = await fetch(`${API_URL}/posts`);
            const json = await response.json();
            const filtered = json.filter( post => post.type === "post");
            setPosts(filtered);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }
    fetchPosts();
}, []);

    const filteredPosts = search
        ? posts.filter(post => 
            post.title.toLowerCase().includes(search.toLowerCase()) || 
            post.description.toLowerCase().includes(search.toLowerCase())
        )
        : posts;


return (
    <div className="post-page">
        <h1>Posts</h1>
        <div className="post-cards-grid">
        {filteredPosts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(post => (
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
        ))}
        </div>
    </div>
)

}

export default PostPage