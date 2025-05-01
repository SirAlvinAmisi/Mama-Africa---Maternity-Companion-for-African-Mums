// src/components/topics/FollowedTopics.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import  api  from '../../lib/api';

const FollowedTopics = () => {
  // Fetch followed topics
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['followedTopics'],
    queryFn: () => api.getFollowedTopics().then(res => res.data),
  });

  if (isLoading) {
    return <div className="p-4">Loading followed topics...</div>;
  }

  if (topics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Topics You Follow</h3>
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">You haven't followed any topics yet.</p>
          <Link 
            to="/topics" 
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Explore topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Topics You Follow</h3>
      <div className="divide-y">
        {topics.map(topic => (
          <Link 
            key={topic.id} 
            to={`/topics/${topic.id}`}
            className="block py-3 hover:bg-gray-50 transition px-2 -mx-2 rounded"
          >
            <div className="font-medium text-cyan-700">{topic.name}</div>
            <div className="text-xs text-gray-500 mt-1">{topic.newContent} new items</div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link 
          to="/topics" 
          className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
        >
          View all topics
        </Link>
      </div>
    </div>
  );
};

export default FollowedTopics;
