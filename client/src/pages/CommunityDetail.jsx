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
import CommentThread from '../components/CommentThread';

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
    if (!newPostContent.trim() && !newPostMedia) {
      alert("Please add some content or attach media.");
      return;
    }

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
      console.error("🚫 Post failed:", err);
      alert(err.response?.data?.error || "Something went wrong while posting.");
    }
  };

  if (loading) return <div className="text-center py-10 text-purple-700">Loading...</div>;
  if (error || !community) return <div className="text-center text-red-500"></div>;

  return (
    <div className="bg-cyan-100 rounded  p-6 max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="bg-cyan-500 p-4 rounded shadow sticky top-4 h-fit">
        <h1 className="text-2xl font-bold text-purple-800">{community.name}</h1>
        <p className="text-purple-700 mt-1">{community.description}</p>
        <p className="text-sm font-medium text-purple-900">{community.member_count} members</p>
        <button onClick={handleJoinLeave} className="mt-3 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
          {community.is_member ? 'Leave Community' : 'Join Community'}
        </button>

        {community.is_member && (
          <>
            <p onClick={() => setShowMyPosts(!showMyPosts)} className="mt-3 cursor-pointer text-purple-900 underline text-sm">
              {showMyPosts ? 'Hide My Posts' : 'View My Posts'}
            </p>

            {showMyPosts && (
              <div className="mt-4 space-y-4">
                {myPosts.map(post => (
                  <div key={post.id} className="bg-purple-50 p-4 rounded shadow border-l-4 border-purple-400">
                    <p className="text-sm text-purple-900">
                      {post.group_name ? `${post.group_name} · ` : ''}by {post.user_name || 'Anonymous'} · {moment(post.created_at).fromNow()}
                    </p>
                    <p className="mt-2 text-gray-800 break-words">{post.content}</p>
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-700 text-xs mt-2">Delete</button>
                  </div>
                ))}
              </div>
            )}

            <div className="hidden lg:block mt-6">
              <h2 className="text-lg font-semibold text-purple-800 mb-1">Write New Post</h2>
              <textarea
                className="w-full border border-purple-200 p-2 text-gray-800 text-sm bg-white rounded"
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setShowEmojiPickerPost(!showEmojiPickerPost)}>😀</button>
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  className="bg-purple-100 p-2 rounded text-gray-700"
                  onChange={(e) => setNewPostMedia(e.target.files[0])}
                />
              </div>
              {showEmojiPickerPost && <Picker onEmojiSelect={addEmojiToPost} theme="light" />}
              <button onClick={handlePostSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 mt-2 rounded text-sm">
                Submit Post
              </button>
            </div>
          </>
        )}
      </div>

      {/* Feed Area */}
      <div className="space-y-6 lg:col-span-2">
        {posts.map(post => (
          <div key={post.id} className="bg-cyan-100 p-4 rounded shadow border-l-4 border-purple-400">
            <p className="text-sm text-purple-800">
              {post.group_name ? `${post.group_name} · ` : ''}by {post.user_name || 'Anonymous'} · {moment(post.created_at).fromNow()}
            </p>
            <p className="mt-2 break-words text-gray-800">{post.content}</p>
            <div className="flex items-center space-x-3 mt-3 text-sm text-gray-700">
              <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1 text-purple-700">
                {post.liked_by_user ? <FaHeart className="text-red-600" /> : <FiHeart />} <span>{post.like_count}</span>
              </button>
              <button
                onClick={() => setActiveComments({ ...activeComments, [post.id]: !activeComments[post.id] })}
                className="text-cyan-800"
              >
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
                  className="w-full border border-cyan-200 p-2 text-sm text-gray-800 bg-white rounded"
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
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-1 rounded text-sm"
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
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CommunityDetail;
