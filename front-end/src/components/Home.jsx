import { useNavigate, useSearchParams } from "react-router-dom";
import {  useState, useEffect } from "react";
import PostCard from "./PostCard";
import CalloutCard from './CalloutCard';
import TrendingCarousel from "./TrendingCarousel";
import { API_URL } from "../API";




function HomePage() {
const navigate = useNavigate();
const [allPosts, setAllPosts] = useState([]);
const [allCallouts, setAllCallouts] = useState([]);
const [trending, setTrending] = useState([]);
const [error, setError] = useState(null);

const [searchParams] = useSearchParams();
const search = searchParams.get("search")?.toLowerCase();


async function fetchAllPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
    }
}

useEffect( () => {
    async function getPosts() {
        const allPosts = await fetchAllPosts();
        if (allPosts) {
            setAllPosts(allPosts.filter(post => post.type === "post"));
            setAllCallouts(allPosts.filter(post => post.type === 'callout'));
            setTrending(allPosts.filter(post => post.isFeatured || post.trendingScore > 10));
        } else {
            console.log("Failed to load posts");
        }
    }   
    getPosts();
}, [])

const postsToDisplay = search 
    ? allPosts.filter(post => 
        post.title.toLowerCase().includes(search) ||
        post.description.toLowerCase().includes(search)
    ) : allPosts;

const filteredCallouts = search
    ? allCallouts.filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.description.toLowerCase().includes(search)
      )
    : allCallouts;


return (
    <div>
      <div className="homepage-container">
            

        <main>
            <TrendingCarousel posts={trending}/>

            <div className="content-columns">
                <section>
                    <h2>Posts</h2>
                    <div className="posts-grid">
                    {postsToDisplay.map(post => (
                        <PostCard
                        key={post.id}
                        id={post.id}
                        onClick={() => navigate(`/posts/${post.id}`)}
                        title={post.title}
                        description={post.description}
                        image={post.images[0]?.url}
                        category={post.category.name}
                        location={post.location.city}
                        isAvailable={post.isAvailable}
                        shippingCost={post.shippingCost}
                        shippingResponsibility={post.shippingResponsibility}
                        shippingOption={post.shippingOption}
                        createdAt={post.createdAt}
                        user={post.user.username}
                        likesCount={post.likes.length}
                        commentsCount={post.comments.length}
                        favoritesCount={post.favorites.length}
                      />
                    ))}
                    </div>
                </section>
            </div>

                    <section>
                        <h2>Callouts</h2>
                        <div className="callouts-grid">
                        {filteredCallouts.map(callout => {
                           return <CalloutCard 
                           key={callout.id} 
                           post={callout} />
                        })}
                        </div>
                    </section>
        </main>
    
       
      </div>
    </div>
);
}

 export default HomePage