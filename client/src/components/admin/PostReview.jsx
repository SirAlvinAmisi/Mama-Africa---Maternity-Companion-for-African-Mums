import { useState, useEffect } from "react";
import axios from "axios";

const SENSITIVE_KEYWORDS = ["abuse", "violence", "danger", "misinformation", "unsafe", "illegal"];

const PostReview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flaggedPosts, setFlaggedPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allPosts = response.data.posts || [];
      const matched = allPosts.filter(post =>
        SENSITIVE_KEYWORDS.some(word => post.content.toLowerCase().includes(word))
      );

      setPosts(allPosts);
      setFlaggedPosts(matched);
    } catch (error) {
      console.error("Error fetching posts:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId, status) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:5000/admin/posts/${postId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Post ${status} successfully`);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post status:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="text-gray-600 text-center">Loading posts...</p>;
  if (flaggedPosts.length === 0) return <p className="text-gray-600 text-center">No flagged posts for review.</p>;

  return (
    <div className="space-y-4">
      {flaggedPosts.map(post => (
        <div key={post.id} className="p-4 border rounded shadow-sm bg-red-50">
          <h3 className="text-lg font-bold text-red-800">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
          <p className="text-sm text-gray-500">
            By: <span className="font-medium text-gray-800">{post.user.full_name || "Unknown"}</span> | Community: {post.community.name || "N/A"}
          </p>
          <p className="text-xs text-red-600 font-semibold mt-1">Contains flagged words!</p>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => updatePostStatus(post.id, "approved")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => updatePostStatus(post.id, "flagged")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
            >
              Flag for review
            </button>
            <button
              onClick={() => updatePostStatus(post.id, "rejected")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostReview;
