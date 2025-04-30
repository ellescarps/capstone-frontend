import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
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
  const [loading, setLoading] = useState(true);

  const searchQuery = search?.toLowerCase(); 

  async function fetchAllPosts() {
    try {
      const response = await fetch(`${API_URL}/posts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        throw new Error("Invalid data format received from server");
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const posts = await fetchAllPosts();
        setAllPosts(posts.filter(post => post?.type === "post") || []);
        setAllCallouts(posts.filter(post => post?.type === 'callout') || []);
        setTrending(posts.filter(post => post?.isFeatured || post?.trendingScore > 10) || []);
      } catch (error) {
        console.error("Error loading posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    getPosts();
  }, []);

  const postsToDisplay = search 
    ? allPosts.filter(post => 
        post?.title?.toLowerCase().includes(searchQuery) ||
        post?.description?.toLowerCase().includes(searchQuery)
      ) 
    : allPosts;

  const filteredCallouts = search
    ? allCallouts.filter(post =>
        post?.title?.toLowerCase().includes(searchQuery) ||
        post?.description?.toLowerCase().includes(searchQuery)
      )
    : allCallouts;

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                  {postsToDisplay?.map(post => (
                    <PostCard
                      key={post?.id}
                      id={post?.id}
                      onClick={() => navigate(`/posts/${post?.id}`)}
                      title={post?.title || 'Untitled Post'}
                      description={post?.description || 'No description available'}
                      image={post?.images?.[0]?.url || ''}
                      category={post?.category?.name || 'Uncategorized'}
                      city={post?.city || ''}
                      country={post?.country || ''}
                      isAvailable={post?.isAvailable ?? true}
                      shippingCost={post?.shippingCost || 0}
                      shippingResponsibility={post?.shippingResponsibility || 'UNKNOWN'}
                      shippingOption={post?.shippingOption || 'UNKNOWN'}
                      createdAt={post?.createdAt || new Date().toISOString()}
                      user={post?.user || {}}
                      likesCount={post?.likes?.length || 0}
                      commentsCount={post?.comments?.length || 0}
                      favoritesCount={post?.favorites?.length || 0}
                    />
                  ))}
                  {postsToDisplay?.length === 0 && (
                    <div>No posts found</div>
                  )}
                </div>
              </section>
            )}

            {selectedTab === 'callouts' && (
              <section>
                <div className="callouts-grid">
                  {filteredCallouts?.map(callout => (
                    <CalloutCard
                      key={callout?.id}
                      post={callout || {}}
                      user={callout?.user || {}} 
                      onClick={() => navigate(`/callouts/${callout?.id}`)}
                    />
                  ))}
                  {filteredCallouts?.length === 0 && (
                    <div>No callouts found</div>
                  )}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;