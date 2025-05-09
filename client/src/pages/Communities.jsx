// src/pages/Communities.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Welcome from '../components/WelcomeCard';
import ParentingDevelopment from '../components/ParentingDevelopment';
import BabyCorner from '../components/BabyCorner';
import PostList from '../components/posts/PostList';
import Nutrition from '../components/Nutrition';

const Communities = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedTrimester, setSelectedTrimester] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem('token');

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['communities', selectedTrimester],
    queryFn: async () => {
      const url = selectedTrimester === 'all'
        ? 'http://localhost:5000/communities'
        : `http://localhost:5000/communities?trimester=${selectedTrimester}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch communities');
      const data = await res.json();
      return data.communities;
    }
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedTrimester],
    queryFn: async () => {
      const communityId = groups?.[0]?.id || 1;
      const res = await fetch(`http://localhost:5000/communities/${communityId}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      return data.posts;
    },
    enabled: !!groups.length
  });

  
  // const joinMutation = useMutation({
  //   mutationFn: async (communityId) => {
  //     // const token = localStorage.getItem('token');
  //     const isTokenExpired = (token) => {
  //       try {
  //         if (!token) return true;
  //         const payload = JSON.parse(atob(token.split('.')[1]));
  //         const now = Math.floor(Date.now() / 1000);
  //         return payload.exp < now;
  //       } catch (err) {
  //         console.warn("Failed to decode token", err);
  //         return true; // treat bad tokens as expired
  //       }
  //     };
      
  //     const token = localStorage.getItem("token");
      
  //     if (isTokenExpired(token)) {
  //       alert("Your session has expired. Please log in again.");
  //       localStorage.removeItem("token");
  //       window.location.href = "/login";
  //     }
      
      
  //     console.log("🔐 Token being used:", token); // 🔍 Add this line to debug
  
  //     const res = await fetch(`http://localhost:5000/mums/communities/${communityId}/join`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  
  //     if (!res.ok) {
  //       const errorText = await res.text();
  //       console.error("❌ Join community failed:", res.status, errorText);
  //       throw new Error('Failed to join community');
  //     }
  
  //     return res.json();
  //   },
  //   onSuccess: () => queryClient.invalidateQueries(['communities'])
  // });
  const joinMutation = useMutation({
    mutationFn: async (communityId) => {
      const token = localStorage.getItem("access_token");
  
      // ✅ Only check when token exists
      if (!token) {
        alert("Please log in to join a community.");
        navigate("/login");
        return;
      }
  
      // ✅ Validate token expiry
      const isTokenExpired = (token) => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          return payload.exp < now;
        } catch (err) {
          return true;
        }
      };
  
      if (isTokenExpired(token)) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
  
      // ✅ Proceed with join if token is valid
      const res = await fetch(`http://localhost:5000/mums/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Join community failed:", res.status, errorText);
        throw new Error('Failed to join community');
      }
  
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['communities'])
  });
  

  const leaveMutation = useMutation({
    mutationFn: async (communityId) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/mums/communities/${communityId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to leave community');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['communities'])
  });

  const flagPost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/flag`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to flag post');
      alert('Post flagged successfully');
      queryClient.invalidateQueries(['posts']); // Refresh posts
    } catch (error) {
      console.error('Error flagging post:', error);
      alert('Failed to flag post');
    }
  };

  const flagArticle = async (articleId) => {
    try {
      const res = await fetch(`http://localhost:5000/articles/${articleId}/flag`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to flag article');
      alert('Article flagged successfully');
      queryClient.invalidateQueries(['articles']); // Refresh articles
    } catch (error) {
      console.error('Error flagging article:', error);
      alert('Failed to flag article');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(groups.length / itemsPerPage);

  if (groupsLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading community...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-6">
        <Welcome />

        {/* Community Cards */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-cyan-700">Explore Communities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentGroups.map(group => (
              <div
                key={group.id}
                className="bg-cyan-200 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">{group.name}</h3>
                  {/* Updated class for darker text */}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {group.description?.slice(0, 120)}...
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/communities/${group.id}`)}
                    className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition"
                  >
                    View Community
                  </button>
                  {/* <button
                    onClick={() =>
                      joinMutation.mutate(group.id)
                    }
                    className="text-xs text-black font-bold border border-cyan-900 hover:bg-cyan-100 px-4 py-2 rounded-full transition"
                  >
                    Join
                  </button> */}
                  {localStorage.getItem("access_token") && (
                    <button
                      onClick={() => joinMutation.mutate(group.id)}
                      className="text-xs text-black font-bold border border-cyan-900 hover:bg-cyan-100 px-4 py-2 rounded-full transition"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-cyan-600 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-gray-700 pt-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => (indexOfLastItem < groups.length ? prev + 1 : prev))}
              disabled={indexOfLastItem >= groups.length}
              className="px-4 py-2 bg-cyan-600 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </section>

        {/* Posts */}
        <PostList posts={posts} flagPost={flagPost} />
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <ParentingDevelopment />
        <BabyCorner />
        <Nutrition />
      </div>
    </div>
  );
};

export default Communities;
