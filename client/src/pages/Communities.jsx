import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import Welcome from '../components/WelcomeCard';
import PopularGroups from '../components/PopularGroups';
import ParentingDevelopment from '../components/ParentingDevelopment';
import MothersPost from '../components/MothersPosts';

const Communities = () => {
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // Fetch groups
        const groupsResponse = await axios.get('http://localhost:5000/communities', { withCredentials: true });
        setGroups(groupsResponse.data);
    
        // Fetch posts
        const postsResponse = await axios.get('/posts', { withCredentials: true });
        setPosts(postsResponse.data);
    
        setLoading(false);
      } catch (error) {
        console.error('Error fetching community data:', error);
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading community...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Main Section */}
      <div className="flex-1 flex flex-col gap-6">
        <Welcome />
        <MothersPost posts={posts} />
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <PopularGroups groups={groups} />
        <ParentingDevelopment />
      </div>

    </div>
  );
};

export default Communities;
