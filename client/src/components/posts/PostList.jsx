// src/components/posts/PostList.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../../lib/api';
import CommentThread from '../CommentThread';


const PostList = ({ posts, flagPost }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState({});
  const [shareMsg, setShareMsg] = useState('');

  const commentMutation = useMutation({
    mutationFn: ({ postId, comment }) => api.commentOnPost(postId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  const followMutation = useMutation({
    mutationFn: (threadId) => api.followThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  const shareMutation = useMutation({
    mutationFn: ({ contentType, contentId, recipientEmail }) =>
      recipientEmail
        ? api.shareViaEmail(contentType, contentId, recipientEmail)
        : api.shareContent(contentType, contentId),
    onSuccess: () => {
      setShareMsg('Content shared successfully!');
      setTimeout(() => setShareMsg(''), 3000);
    },
    onError: () => {
      setShareMsg('Error sharing content');
      setTimeout(() => setShareMsg(''), 3000);
    },
  });

  const handleCommentSubmit = (postId) => {
    if (!commentText[postId]?.trim()) return;
    commentMutation.mutate({ postId, comment: { content: commentText[postId] } });
    setCommentText({ ...commentText, [postId]: '' });
  };

  const handleShare = (postId, recipientEmail = null) => {
    shareMutation.mutate({ contentType: 'post', contentId: postId, recipientEmail });
  };

  return (
    <div className="space-y-6">
      {shareMsg && (
        <p className={`text-center ${shareMsg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {shareMsg}
        </p>
      )}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-4">{post.content}</p>
          <div className="flex gap-4 mb-4">
            <button
              className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
              onClick={() => followMutation.mutate(post.id)}
            >
              Follow Thread
            </button>
            <button
              className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
              onClick={() => handleShare(post.id)}
            >
              Share
            </button>
            <button
              className="bg-cyan-600 text-white px-4 py-1 rounded hover:bg-cyan-700"
              onClick={() => {
                const email = prompt('Enter recipient email:');
                if (email) handleShare(post.id, email);
              }}
            >
              Share via Email
            </button>
            <button
              onClick={() => flagPost(post.id)}
              className={`text-sm px-2 py-1 rounded ${
                post.is_flagged ? 'bg-red-200 text-red-600' : 'bg-gray-200 text-gray-600'
              }`}
              disabled={post.is_flagged}
            >
              {post.is_flagged ? '🚩 Flagged' : '🚩 Flag'}
            </button>
          </div>
          <textarea
            className="w-full p-3 border rounded mb-2"
            placeholder="Add a comment..."
            value={commentText[post.id] || ''}
            onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
          />
          <button
            className="bg-blue-button text-white px-4 py-2 rounded"
            onClick={() => handleCommentSubmit(post.id)}
          >
            Comment
          </button>
          {post.comments?.length > 0 && (
            <CommentThread comments={post.comments} />
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;