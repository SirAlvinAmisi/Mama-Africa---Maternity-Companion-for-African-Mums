// CommunityDetail.jsx (Refactored)
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Picker from '@emoji-mart/react';

import {
  getCommunityById,
  getCommunityPosts,
  getMyPosts,
  getCurrentUser,
  joinCommunityById,
  leaveCommunityById,
  createCommunityPost,
  deletePost,
  likePost,
  createComment,
  deleteComment,
} from '../lib/api';

// import CommentThread from './CommentThread';

const CommunityDetail = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newComments, setNewComments] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [activeComments, setActiveComments] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [showEmojiPickerPost, setShowEmojiPickerPost] = useState(false);
  const [activeEmojiCommentPicker, setActiveEmojiCommentPicker] = useState(null);

  const token = localStorage.getItem('access_token');
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then(res => setCurrentUserId(res.user_id))
        .catch(err => console.error('User fetch failed', err));
    }
    fetchCommunityData();
  }, [id]);

  const fetchCommunityData = async () => {
    try {
      const communityData = await getCommunityById(id);
      setCommunity(communityData);

      const postData = await getCommunityPosts(id);
      setPosts(postData || []);

      if (isLoggedIn) {
        const mine = await getMyPosts();
        setMyPosts((mine || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    fetchCommunityData();
  };

  const handleComment = async (postId, key = postId, parentId = null) => {
    const content = newComments[key]?.trim();
    if (!content) return;
    await createComment(postId, { content, parent_comment_id: parentId });
    const updated = { ...newComments };
    delete updated[key];
    setNewComments(updated);
    setReplyTo(null);
    setActiveReplyBox(null);
    fetchCommunityData();
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    fetchCommunityData();
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    fetchCommunityData();
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setActiveReplyBox(commentId);
  };

  const handleJoinLeave = async () => {
    if (community.is_member) {
      await leaveCommunityById(id);
    } else {
      await joinCommunityById(id);
    }
    fetchCommunityData();
  };

  const addEmojiToPost = (emoji) => {
    setNewPostContent(prev => prev + emoji.native);
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() && !newPostMedia) return;
    try {
      const form = new FormData();
      form.append('content', newPostContent);
      if (newPostMedia) form.append('media', newPostMedia);

      await createCommunityPost(id, form);
      setNewPostContent('');
      setNewPostMedia(null);
      toast.success('✅ Posted successfully!');
      setShowEmojiPickerPost(false);
      fetchCommunityData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.response?.status === 400) {
        alert('🚫 Post rejected: ' + err.response.data.error);
      } else {
        console.error('Error posting:', err);
        alert('Something went wrong while posting.');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !community) return <div className="text-center text-red-500"></div>;

  return (
    <div className="container mx-auto p-4 overflow-x-hidden flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="lg:w-1/3 w-full bg-white p-4 rounded shadow lg:sticky lg:top-4 lg:h-[90vh] lg:overflow-y-auto">
        <h1 className="text-2xl font-semibold text-cyan-900 mb-2">{community.name}</h1>
        <p className="text-gray-700">{community.description}</p>
        <p className="text-sm font-medium text-blue-900">{community.member_count} members</p>
        <button onClick={handleJoinLeave} className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700">
          {community.is_member ? 'Leave Community' : 'Join Community'}
        </button>

        {community.is_member && (
          <>
            <p onClick={() => setShowMyPosts(!showMyPosts)} className="mt-3 cursor-pointer text-cyan-700 underline text-sm">
              {showMyPosts ? 'Hide My Posts' : 'View My Posts'}
            </p>

            {showMyPosts && (
              <div className="mt-4 space-y-4">
                {myPosts.map(post => (
                  <div key={post.id} className="bg-white p-4 rounded shadow-md">
                    <p className="text-sm text-cyan-900">
                      {post.group_name ? `${post.group_name} · ` : ''}by {post.user_name || 'Anonymous'} · {moment(post.created_at).fromNow()}
                    </p>
                    <p className="mt-2 text-gray-700 break-words">{post.content}</p>
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-700 font-medium text-xs mt-2">Delete</button>
                  </div>
                ))}
              </div>
            )}

            <div className="hidden lg:block mt-6">
              <h2 className="text-lg font-semibold text-cyan-900 mb-1">Write New Post</h2>
              <textarea
                className="w-full border border-cyan-200 p-2 text-gray-700 text-sm bg-white rounded"
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setShowEmojiPickerPost(!showEmojiPickerPost)}>😀</button>
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  className="bg-gray-100 p-2 rounded text-gray-700"
                  onChange={(e) => setNewPostMedia(e.target.files[0])}
                />
              </div>
              {showEmojiPickerPost && <Picker onEmojiSelect={addEmojiToPost} theme="light" />}
              <button onClick={handlePostSubmit} className="bg-cyan-900 hover:bg-cyan-700 text-white px-4 py-1 mt-2 rounded text-sm">
                Submit Post
              </button>
            </div>
          </>
        )}
      </div>

      {/* Feed Area */}
      <div className="lg:w-2/3 w-full space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded shadow-md">
            <p className="text-sm text-cyan-900">
              {post.group_name ? `${post.group_name} · ` : ''}by {post.user_name || 'Anonymous'} · {moment(post.created_at).fromNow()}
            </p>
            <p className="mt-2 break-words text-gray-700">{post.content}</p>
            <div className="flex items-center space-x-3 mt-3 text-sm text-gray-700">
              <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1">
                {post.liked_by_user ? <FaHeart className="text-red-600" /> : <FiHeart />} <span>{post.like_count}</span>
              </button>
              <button onClick={() => setActiveComments({ ...activeComments, [post.id]: !activeComments[post.id] })}>
                💬 {post.comment_count || 0} Comments
              </button>
            </div>

            {activeComments[post.id] && (
              <div className="mt-4 space-y-3">
                {post.comments?.map(comment => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    currentUserId={currentUserId}
                    handleReply={handleReply}
                    handleDeleteComment={handleDeleteComment}
                    activeReplyBox={activeReplyBox}
                    newComments={newComments}
                    setNewComments={setNewComments}
                    handleComment={handleComment}
                  />
                ))}
                <textarea
                  placeholder="Write a comment..."
                  value={newComments[post.id] || ''}
                  onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                  className="w-full border border-cyan-200 p-2 text-sm text-gray-700 bg-white rounded"
                />
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() =>
                      setActiveEmojiCommentPicker(
                        activeEmojiCommentPicker === post.id ? null : post.id
                      )
                    }
                    className="text-sm"
                  >😀</button>
                  <button
                    onClick={() => handleComment(post.id)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-1 rounded text-sm"
                  >Add Comment</button>
                </div>
                {activeEmojiCommentPicker === post.id && (
                  <Picker
                    onEmojiSelect={(emoji) => setNewComments(prev => ({ ...prev, [post.id]: (prev[post.id] || '') + emoji.native }))}
                    theme="light"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="lg:hidden fixed bottom-4 right-4 bg-cyan-600 text-white rounded-full p-3 shadow-lg hover:bg-cyan-700"
        >↑ Top</button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CommunityDetail;
