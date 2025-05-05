import { useState, useEffect } from "react";
import axios from "axios";

export default function PostReview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:5000/admin/posts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://localhost:5000/admin/posts/${id}`, { status: action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(`Error trying to ${action} the post:`, error);
    }
  };

  if (loading) {
    return <p>Loading pending posts...</p>;
  }

  if (posts.length === 0) {
    return <p>No posts awaiting review!</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border border-gray-200 rounded-lg shadow-sm bg-cyan-400"
        >
          <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
          <p className="text-gray-800">{post.content}</p>

          {post.user?.full_name || post.community?.name ? (
            <p className="text-sm text-white mt-2">
              {post.user?.full_name && (
                <>By: <span className="font-semibold">{post.user.full_name}</span></>
              )}
              {post.community?.name && (
                <> | Community: <span className="italic">{post.community.name}</span></>
              )}
            </p>
          ) : null}

          <div className="flex justify-between items-center mt-3">
            <p className="flex items-center gap-2">
              Status:
              {post.is_approved ? (
                <span className="text-green-600">✅ Approved</span>
              ) : (
                <span className="text-gray-600">⏳ Pending</span>
              )}
            </p>

            <div className="flex gap-2 text-black">
              <button
                onClick={() => handleAction(post.id, "approved")}
                disabled={post.is_approved}
                className={`px-4 py-1 rounded ${
                  post.is_approved
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 text-green-700 hover:bg-green-200"
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(post.id, "rejected")}
                disabled={post.is_approved}
                className={`px-4 py-1 rounded ${
                  post.is_approved
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
