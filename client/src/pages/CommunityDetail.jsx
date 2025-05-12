import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Picker from '@emoji-mart/react';



const CommentThread = ({
  comment,
  postId,
  currentUserId,
  handleReply,
  handleDeleteComment,
  activeReplyBox,
  newComments,
  setNewComments,
  handleComment,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showEmojiPickerReply, setShowEmojiPickerReply] = useState(false);
  const [showEmojiPickerComment, setShowEmojiPickerComment] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const isTopLevel = comment.parent_comment_id === null;
  const replyKey = `${postId}-${comment.id}`;
  const commentKey = `${postId}-main-comment`;

  const addEmojiToReply = (emoji) => {
    setNewComments((prev) => ({
      ...prev,
      [replyKey]: (prev[replyKey] || '') + emoji.native,
    }));
  };

  const addEmojiToComment = (emoji) => {
    setNewComments((prev) => ({
      ...prev,
      [commentKey]: (prev[commentKey] || '') + emoji.native,
    }));
  };

  const handleSubmitReply = () => {
    const content = newComments[replyKey]?.trim();
    if (!content) return;
    handleComment(postId, replyKey, comment.id);
  };

  const handleSubmitComment = () => {
    const content = newComments[commentKey]?.trim();
    if (!content) return;
    handleComment(postId, commentKey, null);
  };

  return (
    <div className="pl-4 border-l-2 border-cyan-200 bg-cyan-300 p-2 rounded mt-2">
      <div className="flex justify-between items-start">
        <p className="text-sm w-full break-words text-black">{comment.content}</p>
        {comment.user_id === currentUserId && (
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="text-red-500 font-bold text-xs ml-2"
          >
            Delete
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600">
        by {comment.user_id === currentUserId ? 'You' : comment.user_name} ·{' '}
        {moment(comment.created_at).local().fromNow()}
      </p>

      <button
        onClick={() => {
          handleReply(comment.id);
          setShowReplyBox(!showReplyBox);
        }}
        className="text-xs text-blue-500"
      >
        {showReplyBox ? 'Cancel' : 'Reply'}
      </button>

      {activeReplyBox === comment.id && showReplyBox && (
        <div className="mt-2">
          <textarea
            value={newComments[replyKey] || ''}
            onChange={(e) =>
              setNewComments({ ...newComments, [replyKey]: e.target.value })
            }
            className="w-full border p-1 text-sm text-black bg-gray-100 rounded"
            placeholder={`Reply to ${comment.user_name}`}
          />
          <div className="flex items-center space-x-2 mt-1">
            <button
              onClick={() => setShowEmojiPickerReply(!showEmojiPickerReply)}
              className="text-sm"
            >
              😀
            </button>
            <button
              onClick={handleSubmitReply}
              className="bg-cyan-600 text-white px-2 py-1 rounded text-xs"
            >
              Submit Reply
            </button>
          </div>
          {showEmojiPickerReply && <Picker onEmojiSelect={addEmojiToReply} theme="light" />}
        </div>
      )}

      {isTopLevel && (
        <div className="mt-2">
          <textarea
            placeholder="Write a comment..."
            value={newComments[commentKey] || ''}
            onChange={(e) =>
              setNewComments({ ...newComments, [commentKey]: e.target.value })
            }
            className="w-full border p-2 text-sm text-black bg-gray-300 rounded"
          />
          <div className="flex items-center space-x-2 mt-1">
            <button
              onClick={() => setShowEmojiPickerComment(!showEmojiPickerComment)}
              className="text-sm"
            >
              😀
            </button>
            <button
              onClick={handleSubmitComment}
              className="bg-cyan-600 font-bold text-black px-4 py-1 rounded text-sm"
            >
              Add Comment
            </button>
          </div>
          {showEmojiPickerComment && (
            <Picker onEmojiSelect={addEmojiToComment} theme="light" />
          )}
        </div>
      )}

      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="ml-2 mt-2">
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            className="text-xs text-cyan-700 underline"
          >
            {showReplies ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
          </button>

          {showReplies && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  currentUserId={currentUserId}
                  handleReply={handleReply}
                  handleDeleteComment={handleDeleteComment}
                  activeReplyBox={activeReplyBox}
                  newComments={newComments}
                  setNewComments={setNewComments}
                  handleComment={handleComment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


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
  const headers = isLoggedIn ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setCurrentUserId(res.data.user_id);
      }).catch(err => {
        console.error('User fetch failed', err);
      });
    }
    fetchCommunityData();
  }, [id]);

  const fetchCommunityData = async () => {
    try {
      const communityRes = await axios.get(`http://localhost:5000/communities/${id}`, { headers });
      setCommunity(communityRes.data?.community || null);
      const postsRes = await axios.get(`http://localhost:5000/communities/${id}/posts`, { headers });
      setPosts(postsRes.data.posts || []);
      if (isLoggedIn) {
        const myPostsRes = await axios.get('http://localhost:5000/my-posts', { headers });
        setMyPosts((myPostsRes.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    await axios.post(`http://localhost:5000/posts/${postId}/like`, {}, { headers });
    fetchCommunityData();
  };

  const handleComment = async (postId, key = postId, parentId = null) => {
    const content = newComments[key]?.trim();
    if (!content) return;
    await axios.post(`http://localhost:5000/posts/${postId}/comments`, {
      content,
      parent_comment_id: parentId,
    }, { headers });
    const updated = { ...newComments };
    delete updated[key];
    setNewComments(updated);
    setReplyTo(null);
    setActiveReplyBox(null);
    fetchCommunityData();
  };

  const handleDeleteComment = async (commentId) => {
    await axios.delete(`http://localhost:5000/comments/${commentId}`, { headers });
    fetchCommunityData();
  };

  const handleDeletePost = async (postId) => {
    await axios.delete(`http://localhost:5000/posts/${postId}`, { headers });
    fetchCommunityData();
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setActiveReplyBox(commentId);
  };

  const handleJoinLeave = async () => {
    const url = community.is_member
      ? `http://localhost:5000/communities/${id}/leave`
      : `http://localhost:5000/communities/${id}/join`;
    await axios.post(url, {}, { headers });
    fetchCommunityData();
  };


  const addEmojiToPost = (emoji) => {
    setNewPostContent(prev => prev + emoji.native);
  };
  const addEmojiToComment = (emoji, postId) => {
    setNewComments(prev => ({ ...prev, [postId]: (prev[postId] || '') + emoji.native }));
  };


  const handlePostSubmit = async () => {
    if (!newPostContent.trim() && !newPostMedia) return;
    try {
      const form = new FormData();
      form.append('content', newPostContent);
      if (newPostMedia) form.append('media', newPostMedia);
      await axios.post(`http://localhost:5000/communities/${id}/posts`, form, { headers });
      setNewPostContent('');
      setNewPostMedia(null);
      toast.success('✅ Posted successfully!');
      setShowEmojiPickerPost(false);
      fetchCommunityData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('🚫 Post rejected: ' + err.response.data.error);
      } else {
        console.error('Error posting:', err);
        alert('Something went wrong while posting.');
      }
    }
  };

  const renderPostCard = (post, showDelete = false) => (
    <div key={post.id} className="bg-cyan-400 p-4 rounded shadow">
      <p className="text-sm text-cyan-900">
        {post.group_name ? `${post.group_name} · ` : ''}
        by <span className="font-semibold">{post.user_name || 'Anonymous'}</span> · {moment(post.created_at).local().fromNow()}
      </p>
      <p className="mt-2 break-words">{post.content}</p>
      {post.media_url && (
        post.media_type === 'video' ? (
          <video
            controls
            loop
            autoPlay
            muted
            className="w-full mt-2 rounded"
          >
            <source src={`http://localhost:5000${post.media_url}`} />
          </video>
        ) : post.media_type === 'audio' ? (
          <audio controls className="w-full mt-2">
            <source src={`http://localhost:5000${post.media_url}`} />
          </audio>
        ) : (
          <img src={`http://localhost:5000${post.media_url}`} alt="media" className="w-full mt-2 rounded" />
        )
      )}
      <div className="flex justify-between items-center text-sm text-black mt-3">
        <div className="flex items-center space-x-3">
          <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1">
            {post.liked_by_user ? <FaHeart className="text-red-600 font-bold" /> : <FiHeart />} <span>{post.like_count}</span>
          </button>
          <button onClick={() => setActiveComments({ ...activeComments, [post.id]: !activeComments[post.id] })}>
            💬 {post.comment_count || 0} Comments
          </button>
        </div>
        {showDelete && (
          <button onClick={() => handleDeletePost(post.id)} className="text-red-900 font-bold text-xs">Delete</button>
        )}
      </div>
      {activeComments[post.id] && (
        <div className="mt-4 space-y-3 bg-cyan-400">
          {post.comments?.map((comment) => (
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
          <div className="mt-2">
  <textarea
    placeholder="Write a comment..."
    value={newComments[post.id] || ''}
    onChange={(e) =>
      setNewComments({ ...newComments, [post.id]: e.target.value })
    }
    className="w-full border p-2 text-sm text-black bg-gray-300 rounded"
  />
 <div className="flex items-center space-x-2 mt-1">
  <button
    onClick={() =>
      setActiveEmojiCommentPicker(
        activeEmojiCommentPicker === post.id ? null : post.id
      )
    }
    className="text-sm"
  >
    😀
  </button>
  <button
    onClick={() => handleComment(post.id)}
    className="bg-cyan-600 font-bold text-black px-4 py-1 rounded text-sm"
  >
    Add Comment
  </button>
</div>

{activeEmojiCommentPicker === post.id && (
  <div className="mt-2">
    <Picker
      onEmojiSelect={(emoji) => addEmojiToComment(emoji, post.id)}
      theme="light"
    />
  </div>
)}

</div>

        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !community) return <div className="text-center text-red-500"></div>;

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/3 w-full bg-cyan-400 p-4 rounded shadow lg:sticky lg:top-4 lg:h-[90vh] lg:overflow-y-auto">
        <h1 className="text-2xl font-bold text-cyan-900 mb-2">{community.name}</h1>
        <p className='text-black'>{community.description}</p>
        <p className="text-sm font-bold text-blue-900">{community.member_count} members</p>
        <button onClick={handleJoinLeave} className="mt-2 px-3 py-1 bg-cyan-600 text-black text-sm rounded">
          {community.is_member ? 'Leave Community' : 'Join Community'}
        </button>
        {community.is_member && (
          <>
            <p onClick={() => setShowMyPosts(!showMyPosts)} className="mt-3 cursor-pointer text-cyan-700 underline text-sm">
              {showMyPosts ? 'Hide My Posts' : 'View My Posts'}
            </p>
            {showMyPosts && (
              <div className="mt-4 space-y-4">
                {myPosts.map(post => renderPostCard(post, true))}
              </div>
            )}
            <div className="hidden lg:block mt-6">
              <h2 className="text-lg font-bold text-cyan-900 mb-1">Write New Post</h2>
              <textarea
                className="w-full border p-2 text-black text-sm bg-gray-200 rounded"
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <button onClick={() => setShowEmojiPickerPost(!showEmojiPickerPost)} className="mt-1">😀</button>
              {showEmojiPickerPost && <Picker onEmojiSelect={addEmojiToPost} theme="light" />}
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                className="mt-2 bg-gray-100 p-2 rounded text-black"
                onChange={(e) => setNewPostMedia(e.target.files[0])}
              />
              <button onClick={handlePostSubmit} className="bg-cyan-900 text-white px-4 py-1 mt-2 rounded text-sm">
                Submit Post
              </button>
            </div>
          </>
        )}
      </div>
      <div className="lg:w-2/3 w-full space-y-6">
        {community.is_member && (
          <div className="block lg:hidden bg-cyan-400 p-4 rounded shadow">
            <h2 className="text-lg font-bold text-cyan-900 mb-1">Write a Post</h2>
            <textarea
              className="w-full border p-2 text-sm bg-gray-100 text-black"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <button onClick={() => setShowEmojiPickerPost(!showEmojiPickerPost)} className="mt-1">😀</button>
            {showEmojiPickerPost && <Picker onEmojiSelect={addEmojiToPost} theme="light" />}
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              className="mt-2"
              onChange={(e) => setNewPostMedia(e.target.files[0])}
            />
            <button onClick={handlePostSubmit} className="bg-cyan-600 text-black px-4 py-1 mt-2 rounded text-sm">
              Submit Post
            </button>
          </div>
        )}
        {posts.map(post => renderPostCard(post, false))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CommunityDetail;
