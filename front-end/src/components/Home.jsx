import { useNavigate } from "react-router-dom";
import {  useState, useEffect, useContext } from "react";
import PostCard from "./PostCard";
import CalloutCard from './CalloutCard';
import { API_URL } from "../API";
import { AuthContext } from "./AuthContext";


function HomePage({ search }) {
const { user, token } = useContext(AuthContext);
const navigate = useNavigate();
const [allPosts, setAllPosts] = useState([]);
const [allCallouts, setAllCallouts] = useState([]);
const [trending, setTrending] = useState([]);
const [error, setError] = useState(null);
const [selectedTab, setSelectedTab] = useState('posts');


const searchQuery = search?.toLowerCase(); 


async function fetchAllPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const json = await response.json();

        if (!Array.isArray(json)) {
            console.error("Expected an array but got:", json);
            setError("Unexpected data format from API.");
            return [];
        }
        
        return json;
    } catch (error) {
        console.error(error);
        setError("Failed to fetch posts");
        return [];
    }
}

useEffect( () => {
    async function getPosts() {
        const allPosts = await fetchAllPosts();

       
        if (Array.isArray(allPosts)) {
            setAllPosts(allPosts.filter(post => post.type === "post"));
            setAllCallouts(allPosts.filter(post => post.type === 'callout'));
            setTrending(allPosts.filter(post => post.isFeatured || post.trendingScore > 10));
        }
    }
    getPosts();
}, [token]);

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

    if (error) { return <div>Error: {error}</div>};

return (
    <div className="home-background">
      <div className="homepage-container">
            

        <main>

          <div className="tab-buttons">
            <button
              className={selectedTab === 'posts' ? 'active' : ''}
              onClick={() => setSelectedTab('posts')}
            >
              POSTS
            </button>

            <button
              className={selectedTab === 'callouts' ? 'active' : ''}
              onClick={() => setSelectedTab('callouts')}
            >
              CALLOUTS
            </button>
          </div>

          <div className="content-columns">
            {selectedTab === 'posts' && (
              <section>
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
                      city={post.city}
                      country={post.country}
                      isAvailable={post.isAvailable}
                      shippingCost={post.shippingCost}
                      shippingResponsibility={post.shippingResponsibility}
                      shippingOption={post.shippingOption}
                      createdAt={post.createdAt}
                      user={post.user}
                      likesCount={post.likes.length}
                      commentsCount={post.comments.length}
                      favoritesCount={post.favorites.length}
                    />
                  ))}
                </div>
              </section>
            )}

{selectedTab === 'callouts' && (
              <section>
                <div className="callouts-grid">
                  {filteredCallouts.map(callout => (
                    <CalloutCard
                      key={callout.id}
                      post={callout}
                      user={callout.user} 
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

 export default HomePage