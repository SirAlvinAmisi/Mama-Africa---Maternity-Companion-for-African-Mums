import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CommunityDetail = () => {
  const { id } = useParams();  // get community ID from URL
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);  // ✅ Add error state

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const communityResponse = await axios.get(`http://localhost:5000/communities/${id}`);
        if (communityResponse.data && communityResponse.data.community) {
          setCommunity(communityResponse.data.community);
        } else {
          setError(true);
        }

        const postsResponse = await axios.get(`http://localhost:5000/communities/${id}/posts`);
        setPosts(postsResponse.data.posts || []);

      } catch (error) {
        console.error('Error fetching community details:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading community details...
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-500">
        Community not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Community Info */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-cyan-700 mb-4">{community.name}</h1>
        <p className="text-gray-700 text-lg">{community.description}</p>
      </div>

      {/* Posts/Conversations */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-700 mb-6">Conversations</h2>
        
        {posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <div key={post.id} className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No conversations yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
