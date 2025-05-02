// src/components/CommentThread.jsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../lib/api';

const CommentThread = ({ comments, depth = 0 }) => {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: ({ commentId, voteType }) => api.voteOnComment(commentId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['questions']);
    },
  });

  const handleVote = (commentId, voteType) => {
    voteMutation.mutate({ commentId, voteType });
  };

  return (
    <div className={`ml-${depth * 4} space-y-4 mt-4`}>
      {comments.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">{comment.content}</p>
          <div className="flex gap-4 mt-2">
            <button
              className="text-cyan-600 hover:text-cyan-700"
              onClick={() => handleVote(comment.id, 'upvote')}
            >
              Upvote ({comment.upvotes || 0})
            </button>
            <button
              className="text-cyan-600 hover:text-cyan-700"
              onClick={() => handleVote(comment.id, 'downvote')}
            >
              Downvote ({comment.downvotes || 0})
            </button>
            {comment.is_pinned && (
              <span className="text-green-500 font-semibold">Pinned</span>
            )}
          </div>
          {comment.replies?.length > 0 && (
            <CommentThread comments={comment.replies} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentThread;
