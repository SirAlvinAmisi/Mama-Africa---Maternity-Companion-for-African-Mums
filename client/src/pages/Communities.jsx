
import React, { useState, useEffect } from 'react';
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

        const groupsResponse = await fetch('/api/groups/popular');
        const groupsData = await groupsResponse.json();
        setGroups(groupsData);


        const postsResponse = await fetch('/api/posts/recent');
        const postsData = await postsResponse.json();
        setPosts(postsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching community data:', error);
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  if (loading) return <div className="loading">Loading community...</div>;

  return (
    <div className="community-container">
      <div className="community-main">
        <Welcome />
        <MothersPost posts={posts} />
      </div>
      
      <div className="community-sidebar">
        <PopularGroups groups={groups} />
        <ParentingDevelopment />
      </div>
    </div>
  );
};

export default Communities;