// src/components/community/ThreadList.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fetchThreads, createThread, createComment } from '../../store/threadSlice';

export default function ThreadList({ communityId }) {
  const dispatch = useDispatch();
  const { threads, loading, error } = useSelector((state) => state.thread);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({});
  const [trimesterGroup, setTrimesterGroup] = useState('First Trimester');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (communityId) {
      dispatch(fetchThreads(communityId));
    }
  }, [dispatch, communityId]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThread.title.trim() || !newThread.content.trim()) return;

    await dispatch(createThread({
      community_id: communityId,
      title: newThread.title,
      content: newThread.content,
      trimester_group: trimesterGroup,
      author_id: localStorage.getItem('userId') || 1, // Replace with proper auth
    }));

    setNewThread({ title: '', content: '' });
  };

  const handleCreateComment = async (threadId, parentId = null) => {
    const content = newComment[threadId]?.trim();
    if (!content) return;

    await dispatch(createComment({
      thread_id: threadId,
      content,
      parent_id: parentId,
      author_id: localStorage.getItem('userId') || 1, // Replace with proper auth
    }));

    setNewComment({ ...newComment, [threadId]: '' });
    setReplyingTo(null);
  };

  const handleVote = async (commentId, voteType) => {
    // Dispatch vote action (to be implemented in threadSlice.js)
    await dispatch(voteOnComment({ commentId, voteType }));
  };

  const Comment = ({ comment }) => (
    <div className="ml-4">
      <div className="bg-gray-50 p-3 rounded">
        <p>{comment.content}</p>
        <p className="text-sm text-gray-500">
          Author ID: {comment.author_id} • {format(new Date(comment.created_at), 'PPp')}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleVote(comment.id, 'upvote')}
            className="text-xs text-green-600 hover:text-green-800"
          >
            Upvote ({comment.upvotes || 0})
          </button>
          <button
            onClick={() => handleVote(comment.id, 'downvote')}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Downvote ({comment.downvotes || 0})
          </button>
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Reply
          </button>
        </div>
        {replyingTo === comment.id && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateComment(comment.thread_id, comment.id);
            }}
            className="flex gap-2 mt-2"
          >
            <input
              type="text"
              value={newComment[comment.thread_id] || ''}
              onChange={(e) =>
                setNewComment({ ...newComment, [comment.thread_id]: e.target.value })
              }
              placeholder="Write a reply..."
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Reply
            </button>
          </form>
        )}
      </div>
      {comment.replies?.map((reply) => (
        <Comment key={reply.id} comment={reply} />
      ))}
    </div>
  );

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Community Threads</h2>
        <form onSubmit={handleCreateThread} className="space-y-4 bg-white p-4 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Trimester Group</label>
            <select
              value={trimesterGroup}
              onChange={(e) => setTrimesterGroup(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="First Trimester">First Trimester</option>
              <option value="Second Trimester">Second Trimester</option>
              <option value="Third Trimester">Third Trimester</option>
            </select>
          </div>
          <input
            type="text"
            value={newThread.title}
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            placeholder="Thread Title"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
            placeholder="Thread Content"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Thread
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {threads.map((thread) => (
          <div key={thread.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold">{thread.title}</h3>
            <p className="text-gray-600">{thread.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted by Author ID: {thread.author_id} •{' '}
              {format(new Date(thread.created_at), 'PPp')} • {thread.trimester_group}
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Comments</h4>
              <div className="space-y-2">
                {thread.comments?.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateComment(thread.id);
                }}
                className="flex gap-2 mt-4"
              >
                <input
                  type="text"
                  value={newComment[thread.id] || ''}
                  onChange={(e) =>
                    setNewComment({ ...newComment, [thread.id]: e.target.value })
                  }
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Comment
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
