import React, {useState, useEffect} from "react";
import PostCard from "./PostCard";
import { useParams } from "react-router-dom";
import { API_URL } from "../API";

function CategoryPage() {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);


    useEffect( () => {
        const fetchPostsByCategory = async () => {
            try {
                const response = await fetch(`${API_URL}/posts?category=${categoryName}`);
                const json = await response.json();
                setPosts(json);
            } catch (error) {
                setError("Error fetching posts");
            }
        }
        fetchPostsByCategory();
    }, [categoryName]);

    if (error) return <div>{error}</div>

return (
    <div className="category-page">
        <h1>Category: {categoryName}</h1>
        <div className="category-posts">
        {posts.map(post => (
            <PostCard 
                key={post.id}
                post={post}
            />
        ))}
        </div>
    </div>
      );
}

export default CategoryPage