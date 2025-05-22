import React, { useEffect, useState } from 'react';
import {
  getPendingCommunities,
  updateCommunityStatus,
} from '../../lib/api';

export default function CommunityReview() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    try {
      const data = await getPendingCommunities();
      setCommunities(data || []);
    } catch (err) {
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await updateCommunityStatus(id, action);
      setCommunities(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(`Error trying to ${action} community ${id}:`, err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) return <p>Loading communities...</p>;
  if (communities.length === 0) return <p>No communities awaiting approval.</p>;

  return (
    <div className="space-y-4 bg-cyan-100 p-4 rounded-lg shadow-md">
      {communities.map(community => (
        <div key={community.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-bold text-gray-800">{community.name}</h2>
          <p className="text-gray-600">{community.description}</p>
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => handleAction(community.id, 'approved')}
              className="px-4 py-1 bg-cyan-400 font-bold text-green-700 rounded hover:bg-green-200"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(community.id, 'rejected')}
              className="px-4 py-1 bg-red-100 font-bold text-red-700 rounded hover:bg-red-200"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
