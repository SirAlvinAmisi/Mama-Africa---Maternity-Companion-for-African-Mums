import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Welcome from '../components/WelcomeCard';
// import PopularGroups from '../components/PopularGroups';
import ParentingDevelopment from '../components/ParentingDevelopment';
import BabyCorner from '../components/BabyCorner';
import MothersPost from '../components/MothersPosts';

const Communities = () => {
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const groupsResponse = await axios.get('http://localhost:5000/communities', { withCredentials: false });
        setGroups(groupsResponse.data.communities || []);

        const postsResponse = await axios.get('http://localhost:5000/posts', { withCredentials: true });
        setPosts(postsResponse.data.posts || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching community data:', error);
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(groups.length / itemsPerPage);

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

        {/* Explore Communities */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-cyan-700">Explore Communities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentGroups.map((group) => (
              <div 
                key={group.id} 
                className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {group.description?.slice(0, 120)}...
                  </p>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => navigate(`/communities/${group.id}`)}
                    className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition"
                  >
                    View Community
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-cyan-600 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>

            <span className="text-gray-700 pt-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => (indexOfLastItem < groups.length ? prev + 1 : prev))}
              disabled={indexOfLastItem >= groups.length}
              className="px-4 py-2 bg-cyan-600 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>

        </section>

        {/* Recent Mother Posts */}
        {/* <MothersPost posts={posts} /> */}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        {/* Sidebar: now passing all groups */}
        {/* <PopularGroups groups={groups} /> */}
        <ParentingDevelopment />
        <BabyCorner />
      </div>

    </div>
  );
};

export default Communities;
