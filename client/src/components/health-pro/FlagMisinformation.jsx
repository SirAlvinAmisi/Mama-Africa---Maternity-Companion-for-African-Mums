import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const FlagMisinformation = () => {
  const [posts, setPosts] = useState([]);
  const [flagged, setFlagged] = useState({});
  const token = localStorage.getItem('access_token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:5000/healthpro/group-posts-with-comments', { headers })
    
      .then(res => setPosts(res.data.posts || []))
      .catch(err => console.error('Failed to fetch posts', err));
  }, []);

  const handleFlag = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/flag-post/${postId}`, {}, { headers });
      setFlagged({ ...flagged, [postId]: true });
    } catch (err) {
      console.error('Failed to flag post', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Flag Misinformation</h2>
      <p className="mb-6">Below are community posts with comments. Flag any that seem incorrect or misleading.</p>
      {posts.map(post => (
        <div key={post.id} className="bg-white p-4 shadow-md rounded mb-6">
          <p className="text-sm text-gray-700 mb-1">
            <strong>{post.user_name || 'Anonymous'}</strong> in <em>{post.group_name}</em> · {moment(post.created_at).fromNow()}
          </p>
          <p className="text-black mb-2">{post.content}</p>
          {post.media_url && (
            <img src={`http://localhost:5000${post.media_url}`} alt="media" className="w-full max-h-60 object-cover rounded mb-2" />
          )}
          <button
            onClick={() => handleFlag(post.id)}
            className={`px-4 py-1 rounded text-sm ${flagged[post.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
            disabled={flagged[post.id]}
          >
            {flagged[post.id] ? 'Flagged' : 'Flag as Misinformation'}
          </button>

          {/* Comments */}
          {post.comments?.length > 0 && (
            <div className="mt-4 bg-gray-100 p-3 rounded">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Comments:</h3>
              {post.comments.map(comment => (
                <div key={comment.id} className="mb-2 border-b pb-1 text-black">
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    by <strong>{comment.user_name || 'User'}</strong> · {moment(comment.created_at).fromNow()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlagMisinformation;
