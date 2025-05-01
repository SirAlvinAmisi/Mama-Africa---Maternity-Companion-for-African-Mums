// src/components/community/TrimesterGroupSuggestion.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const TrimesterGroupSuggestion = () => {
  const queryClient = useQueryClient();
  
  const { data: pregnancy, isLoading: pregnancyLoading } = useQuery({
    queryKey: ['pregnancyDetails'],
    queryFn: () => api.getPregnancyDetails().then(res => res.data),
    onError: () => {
      return null;
    }
  });
  
  const { data: communities = [], isLoading: communitiesLoading } = useQuery({
    queryKey: ['trimesterCommunities', pregnancy?.trimester_group],
    queryFn: () => api.getTrimesterCommunities(pregnancy?.trimester_group?.toLowerCase()).then(res => res.data.communities),
    enabled: !!pregnancy?.trimester_group,
  });

  const joinMutation = useMutation({
    mutationFn: (communityId) => api.joinCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries(['trimesterCommunities']);
      queryClient.invalidateQueries(['joinedCommunities']);
    },
  });

  if (pregnancyLoading || communitiesLoading) {
    return <div className="p-2 text-center">Loading suggestions...</div>;
  }

  if (!pregnancy?.trimester_group) {
    return (
      <div className="bg-cyan-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-cyan-800 mb-2 sm:text-base">Complete Your Profile</h3>
        <p className="text-cyan-700 mb-3 text-sm">
          Add your pregnancy details to get trimester-specific group recommendations.
        </p>
        <Link 
          to="/moms/pregnancy" 
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm inline-block hover:bg-cyan-700 transition"
        >
          Add Pregnancy Details
        </Link>
      </div>
    );
  }

  if (communities.length === 0) {
    return null;
  }

  const suggestedCommunities = communities.filter(community => !community.isJoined);
  
  if (suggestedCommunities.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 mb-6 border border-cyan-100">
      <h3 className="text-lg font-semibold text-cyan-800 mb-2 sm:text-base">
        Recommended {pregnancy.trimester_group} Groups
      </h3>
      <p className="text-cyan-700 mb-4 text-sm">
        Join these groups to connect with moms in the same stage of pregnancy.
      </p>
      
      <div className="space-y-3">
        {suggestedCommunities.slice(0, 3).map(community => (
          <div key={community.id} className="bg-white rounded-lg p-3 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <Link to={`/communities/${community.id}`} className="font-medium text-cyan-700 hover:text-cyan-800">
                {community.name}
              </Link>
              <p className="text-xs text-gray-500 mt-1">{community.members || 0} members</p>
            </div>
            <button
              onClick={() => joinMutation.mutate(community.id)}
              className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs hover:bg-cyan-700 transition mt-2 sm:mt-0"
            >
              Join
            </button>
          </div>
        ))}
      </div>
      
      {suggestedCommunities.length > 3 && (
        <div className="mt-3 text-center">
          <Link 
            to="/communities" 
            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
          >
            View all groups
          </Link>
        </div>
      )}
    </div>
  );
};

export default TrimesterGroupSuggestion;
