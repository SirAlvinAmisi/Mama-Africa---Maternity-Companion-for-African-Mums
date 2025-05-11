import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Welcome from '../components/WelcomeCard';
import ParentingDevelopment from '../components/ParentingDevelopment';
import BabyCorner from '../components/BabyCorner';
import PostList from '../components/posts/PostList';
import PopularGroups from '../components/PopularGroups';
import Nutrition from '../components/Nutrition';
import CommunityDetail from './CommunityDetail';
import PostForm from '../components/posts/PostForm';

const Communities = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedTrimester, setSelectedTrimester] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 5;

  const token = localStorage.getItem('access_token');

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  };

  const validToken = token && !isTokenExpired(token);

  const getCommunities = async () => {
    const url = selectedTrimester === 'all'
      ? 'http://localhost:5000/communities'
      : `http://localhost:5000/communities?trimester=${selectedTrimester}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': validToken ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Fetch failed", res.status, text);
      throw new Error('Failed to fetch communities');
    }

    const data = await res.json();
    return data.communities;
  };

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['communities', selectedTrimester],
    queryFn: getCommunities,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedTrimester],
    queryFn: async () => {
      const communityId = groups?.[0]?.id;
      if (!communityId) return [];
      const res = await fetch(`http://localhost:5000/communities/${communityId}/posts`, {
        headers: {
          Authorization: validToken ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      return data.posts;
    },
    enabled: !!groups.length,
  });

  const joinMutation = useMutation({
  mutationFn: async (communityId) => {
    if (!validToken) {
      alert("Please log in to join a community.");
      navigate("/login");
      return;
    }

    const res = await fetch(`http://localhost:5000/communities/${communityId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to join community');
    return res.json();
  },
  onSuccess: (data, communityId) => {
  
    queryClient.setQueryData(['communities', selectedTrimester], (oldData) => {
      return oldData.map(group =>
        group.id === communityId ? { ...group, is_member: true, member_count: data.member_count } : group
      );
    });
  },
});


  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

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

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-cyan-700">Explore Communities</h2>
          <input
            type="text"
            placeholder="Search communities..."
            className="mb-4 p-2 border rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentGroups.map(group => (
              <div
                key={group.id}
                className="bg-cyan-200 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
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
                  {validToken && !group.is_member && (
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
              onClick={() => setCurrentPage(prev => (indexOfLastItem < filteredGroups.length ? prev + 1 : prev))}
              disabled={indexOfLastItem >= filteredGroups.length}
              className="px-4 py-2 bg-cyan-600 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </section>

        <CommunityDetail posts={posts} />
        {/* <PopularGroups groups={groups}/> */}
      </div>

      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <ParentingDevelopment />
        <BabyCorner />
        <Nutrition />
      </div>
    </div>
  );
};

export default Communities;
