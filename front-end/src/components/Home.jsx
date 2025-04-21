import { useNavigate } from "react-router-dom";
import {  useState, useEffect } from "react";
import PostCard from "./PostCard";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer"
import CalloutCard from './CalloutCard';
import TrendingCarousel from "./TrendingCarousel";
import { API_URL } from "../API";


function HomePage( {searchParams}) {
const navigate = useNavigate();
const [allPosts, setAllPosts] = useState([]);
const [allCallouts, setAllCallouts] = useState([]);
const [trending, setTrending] = useState([]);
const [error, setError] = useState(null);


async function fetchAllPosts(id) {
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
            setAllPosts(allPosts);
            setAllCallouts(allPosts.filter(post => post.type === 'callout'));
            setTrending(allPosts.filter(post => post.isFeatured || post.trendingScore > 10));
        } else {
            console.log("Failed to load posts");
        }
    }   
    getPosts();
}, [])

const postsToDisplay = 
searchParams ? allPosts.filter( (post) => post.name.toLowerCase().includes(searchParams.toLowerCase()) )
: allPosts;


return (
    <div>
      <div className="homepage-container">
            <Navbar />
            <Sidebar />

        <main>
            <TrendingCarousel posts={trending}/>

            <div className="content-columns">
                <section>
                    <h2>Posts</h2>
                    <div className="posts-grid">
                    {postsToDisplay.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    </div>
                </section>
            </div>

                    <section>
                        <h2>Callouts</h2>
                        <div className="callouts-grid">
                        {allCallouts.map(callout => {
                           return <CalloutCard key={callout.id} post={callout} />
                        })}
                        </div>
                    </section>
        </main>
    
        <Footer/>
      </div>
    </div>
);
}

 export default HomePage