// src/components/articles/ArticleCard.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import ShareContent from '../sharing/ShareContent';

export default function ArticleCard({ article, isAdmin = false }) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const queryClient = useQueryClient();

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['articleComments', article.id],
    queryFn: () => api.getComments(article.id).then(res => res.data),
    enabled: showComments,
  });

  const commentMutation = useMutation({
    mutationFn: (comment) => api.createComment(article.id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['articleComments', article.id]);
      setNewComment('');
      setReplyingTo(null);
    },
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate({ content: newComment, parent_id: replyingTo });
  };

  const renderComments = (comments, depth = 0) => {
    return comments.map(comment => (
      <div key={comment.id} className={`bg-gray-100 p-2 rounded mb-2 ${depth > 0 ? 'ml-6' : ''}`}>
        <p className="text-gray-700">{comment.content}</p>
        <p className="text-xs text-gray-500">
          By {comment.author?.profile?.full_name || 'Anonymous'} •{' '}
          {new Date(comment.created_at).toLocaleDateString()}
        </p>
        <button
          onClick={() => setReplyingTo(comment.id)}
          className="text-xs text-cyan-600 hover:text-cyan-800 mt-1"
        >
          Reply
        </button>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">{renderComments(comment.replies, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm relative hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{article.content}</p>
        <p className="text-xs text-gray-500 mt-2">
          By {article.author?.profile?.full_name || 'Anonymous'} •{' '}
          {new Date(article.created_at).toLocaleDateString()}
        </p>
        {article.tags && article.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/topics/${tag.id}`}
                className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full hover:bg-cyan-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between border-t pt-3 px-4">
        <button
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
          onClick={() => navigate(`/article/${article.id}`)}
        >
          Read More
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-blue-500 transition flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">{comments?.length || 0} Comments</span>
          </button>

          <ShareContent 
            contentType="article" 
            contentId={article.id} 
            title={article.title}
          />

          <button className="text-gray-500 hover:text-red-500 transition flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">Like</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-3 px-4">
          <h4 className="text-sm font-semibold mb-2">Comments</h4>
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments?.length > 0 ? (
            <div className="space-y-2 mb-4">{renderComments(comments.filter(c => !c.parent_id))}</div>
          ) : (
            <p className="text-gray-500 text-sm mb-2">No comments yet.</p>
          )}

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? 'Add a reply...' : 'Add a comment...'}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              {replyingTo ? 'Reply' : 'Comment'}
            </button>
            {replyingTo && (
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {isAdmin && (
        <div className="mt-3 pt-3 border-t flex justify-between px-4">
          <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
            View Analytics
          </button>
          <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
            Remove Article
          </button>
        </div>
      )}
    </div>
  );
}
