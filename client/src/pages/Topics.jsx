// src/pages/Topics.jsx
import React from 'react';
import TopicList from '../components/topics/TopicList';
import FollowedTopics from '../components/topics/FollowedTopics';

const Topics = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 bg-cyan-500">
      <div className="w-full lg:w-3/4">
        <h1 className="text-3xl font-bold text-black mb-6 sm:text-2xl">Topics</h1>
        <p className="text-black mb-8 text-sm sm:text-base">
          Follow topics you're interested in to see relevant content in your feed and stay updated with new posts.
        </p>
        
        <TopicList />
      </div>
      
      <div className="w-full lg:w-1/4">
        <div className="sticky top-6">
          <FollowedTopics />
        </div>
      </div>
    </div>
  );
};

export default Topics;