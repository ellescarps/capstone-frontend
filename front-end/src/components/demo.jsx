import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCard from './ProfileCard';  // Importing the reusable ProfileCard

function UserProfilePage() {
  const [user, setUser] = useState(null);

  // Get user ID from URL params
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      // Replace with your API call
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUserData();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-profile-container">
      <ProfileCard 
        username={user.username}
        bio={user.bio}
        profilePicUrl={user.profilePicUrl}
        city={user.city}
        country={user.country}
        socialLinks={user.socialLinks}
      />

      {/* Add other sections like posts, callouts, etc., if necessary */}
    </div>
  );
}

export default UserProfilePage;