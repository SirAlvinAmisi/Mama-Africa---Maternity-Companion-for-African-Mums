// src/components/topics/TopicDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../../lib/api';
import ArticleCard from '../articles/ArticleCard';
import PostCard from '../posts/PostCard';
import { trackEvent } from '../../lib/analytics';

const TopicDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: topic, isLoading: topicLoading } = useQuery({
    queryKey: ['topic', id],
    queryFn: () => api.getTopic(id).then(res => res.data),
  });

  const { data: content = { articles: [], posts: [], questions: [] }, isLoading: contentLoading } = useQuery({
    queryKey: ['topicContent', id, activeTab],
    queryFn: () => api.getTopicContent(id, activeTab).then(res => res.data),
  });

  const followMutation = useMutation({
    mutationFn: () => api.followTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['topic', id]);
      trackEvent('topic_follow', { topicId: id });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => api.unfollowTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['topic', id]);
      trackEvent('topic_unfollow', { topicId: id });
    },
  });

  if (topicLoading) {
    return <div className="p-4 text-center">Loading topic...</div>;
  }

  if (!topic) {
    return <div className="p-4 text-center text-red-500">Topic not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-lg shadow-md p-6 mb-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-3xl font-bold sm:text-2xl">{topic.name}</h1>
          {topic.isFollowing ? (
            <button
              onClick={() => unfollowMutation.mutate()}
              className="bg-white text-cyan-700 px-4 py-2 rounded-full hover:bg-gray-100 transition mt-2 sm:mt-0"
            >
              Following
            </button>
          ) : (
            <button
              onClick={() => followMutation.mutate()}
              className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-full hover:bg-white/10 transition mt-2 sm:mt-0"
            >
              Follow
            </button>
          )}
        </div>
        <p className="text-white/90 text-sm">{topic.description}</p>
        <div className="mt-4 text-white/80 text-sm">
          {topic.followers} followers • {topic.articles + topic.posts + topic.questions} related content
        </div>
      </div>
      
      <div className="flex flex-wrap border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'all' ? 'text-cyan-600 border-b-2 border-cyan-600 font-semibold' : 'text-gray-600'} text-sm sm:text-base`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'articles' ? 'text-cyan-600 border-b-2 border-cyan-600 font-semibold' : 'text-gray-600'} text-sm sm:text-base`}
          onClick={() => setActiveTab('articles')}
        >
          Articles
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'posts' ? 'text-cyan-600 border-b-2 border-cyan-600 font-semibold' : 'text-gray-600'} text-sm sm:text-base`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'questions' ? 'text-cyan-600 border-b-2 border-cyan-600 font-semibold' : 'text-gray-600'} text-sm sm:text-base`}
          onClick={() => setActiveTab('questions')}
        >
          Questions
        </button>
      </div>
      
      {contentLoading ? (
        <div className="text-center py-8">Loading content...</div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'all' || activeTab === 'articles' ? (
            <>
              {content.articles.length > 0 && (
                <div className="mb-8">
                  {activeTab === 'all' && <h2 className="text-xl font-semibold mb-4">Articles</h2>}
                  <div className="space-y-4">
                    {content.articles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
          
          {activeTab === 'all' || activeTab === 'posts' ? (
            <>
              {content.posts.length > 0 && (
                <div className="mb-8">
                  {activeTab === 'all' && <h2 className="text-xl font-semibold mb-4">Community Posts</h2>}
                  <div className="space-y-4">
                    {content.posts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
          
          {activeTab === 'all' || activeTab === 'questions' ? (
            <>
              {content.questions.length > 0 && (
                <div className="mb-8">
                  {activeTab === 'all' && <h2 className="text-xl font-semibold mb-4">Questions</h2>}
                  <div className="space-y-4">
                    {content.questions.map(question => (
                      <div key={question.id} className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-lg">{question.question_text}</h3>
                        {question.answer_text && (
                          <div className="mt-2 p-3 bg-cyan-50 rounded">
                            <p className="text-sm font-semibold text-gray-700">Answer:</p>
                            <p>{question.answer_text}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
          
          {((activeTab === 'all' && content.articles.length === 0 && content.posts.length === 0 && content.questions.length === 0) ||
           (activeTab === 'articles' && content.articles.length === 0) ||
           (activeTab === 'posts' && content.posts.length === 0) ||
           (activeTab === 'questions' && content.questions.length === 0)) && (
            <div className="text-center py-8">
              <p className="text-gray-500">No content found for this topic.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicDetail;
