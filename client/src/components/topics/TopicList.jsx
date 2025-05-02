// src/components/topics/TopicList.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../../lib/api';
import { Link } from 'react-router-dom';
import { trackEvent } from '../../lib/analytics';

const TopicList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics', searchTerm],
    queryFn: () => api.searchTopics({ query: searchTerm }).then(res => res.data),
  });

  const followMutation = useMutation({
    mutationFn: (topicId) => api.followTopic(topicId),
    onSuccess: (_, topicId) => {
      queryClient.invalidateQueries(['topics']);
      queryClient.invalidateQueries(['followedTopics']);
      trackEvent('topic_follow', { topicId });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (topicId) => api.unfollowTopic(topicId),
    onSuccess: (_, topicId) => {
      queryClient.invalidateQueries(['topics']);
      queryClient.invalidateQueries(['followedTopics']);
      trackEvent('topic_unfollow', { topicId });
    },
  });

  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="p-4 text-center">Loading topics...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-cyan-700 mb-6">Explore Topics</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search topics or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
      
      {Object.entries(groupedTopics).map(([category, topicsInCategory]) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicsInCategory.map((topic) => (
              <div key={topic.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <Link to={`/topics/${topic.id}`} className="block mb-3">
                  <h4 className="font-semibold text-lg text-cyan-700">{topic.name}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{topic.description}</p>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{topic.followers} followers</span>
                  {topic.isFollowing ? (
                    <button
                      onClick={() => unfollowMutation.mutate(topic.id)}
                      className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm hover:bg-cyan-200 transition"
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={() => followMutation.mutate(topic.id)}
                      className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm hover:bg-cyan-700 transition"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {topics.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No topics found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TopicList;
