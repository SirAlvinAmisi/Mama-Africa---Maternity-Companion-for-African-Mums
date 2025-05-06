import { useState, useEffect } from "react";
import axios from "axios";

const PostReview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.posts || []);
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Post ${status} successfully`);
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error(`Error updating post status:`, error.response || error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="text-gray-600 text-center">Loading posts...</p>;
  if (posts.length === 0) return <p className="text-gray-600 text-center">No pending posts to review.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded shadow-sm bg-gray-100">
          {/* Post Title */}
          <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
          {/* Post Content */}
          <p className="text-gray-700">{post.content}</p>
          {/* Post Metadata */}
          <p className="text-sm text-gray-500">
            By: <span className="font-medium text-gray-800">{post.user.full_name || "Unknown"}</span> | Community:{" "}
            <span className="font-medium text-gray-800">{post.community.name || "N/A"}</span>
          </p>
          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => updatePostStatus(post.id, "approved")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              style={{ backgroundColor: "#16a34a" }} // Explicit green background
            >
              Approve
            </button>
            <button
              onClick={() => updatePostStatus(post.id, "rejected")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostReview;
