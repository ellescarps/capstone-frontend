import React from "react";

function TrendingCarousel({ posts }) {
  if (!posts || posts.length === 0) {
    return <div>No trending posts available.</div>;  
  }

  return (
    <div className="carousel-container">
      <h2>Trending Posts</h2>
      <div className="carousel">
        {posts.map((post) => (
          <div key={post.id} className="carousel-item">
            <img src={post.images[0]?.url} alt={post.title} className="carousel-image" />
            <div className="carousel-details">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingCarousel;
