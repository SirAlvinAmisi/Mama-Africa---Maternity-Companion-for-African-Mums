import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';

function PopularGroups({ groups = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGroups = groups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(groups.length / itemsPerPage);

  const queryClient = useQueryClient();

  const leaveMutation = useMutation({
    mutationFn: (communityId) => api.leaveCommunity(communityId),
    onSuccess: (_data, communityId) => {
      queryClient.invalidateQueries(['joinedGroups']);
      queryClient.invalidateQueries(['communities']);
      // setGroups((prev) => prev.filter((group) => group.id !== communityId)); // ✅ update local
    },
    onError: (err) => {
      console.error("❌ Leave failed:", err);
    }
  });

  const handleLeave = (groupId) => {
    leaveMutation.mutate(groupId);
  };

  return (
  <div className="bg-cyan-100 p-6 rounded-md shadow-md">
    {currentGroups.length === 0 ? (
      <p className="text-gray-600 text-center">You haven't joined any communities yet.</p>
    ) : (
      currentGroups.map((group) => (
        <div key={group.id} className="flex items-center gap-4 mb-4">
          <Link to={`/communities/${group.id}`} className="flex items-center gap-4 flex-1 no-underline text-gray-600">
            <img 
              src={group.image || "https://i.pinimg.com/736x/6d/bd/05/6dbd0505a7b5c42b234e3fb13856e006.jpg"} 
              alt={group.name} 
              className="w-16 h-16 rounded-full object-cover" 
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-600">{group.name}</h3>
              <p className="text-gray-600 font-medium">{group.member_count || 0} members</p>
            </div>
          </Link>

          <button
            onClick={() => handleLeave(group.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            LEAVE
          </button>
        </div>
      ))
    )}

    {/* Pagination Controls */}
    {groups.length > itemsPerPage && (
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-gray-600 pt-2 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(prev => (indexOfLastItem < groups.length ? prev + 1 : prev))}
          disabled={indexOfLastItem >= groups.length}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )}
  </div>
);
}

export default PopularGroups;
