import { useState, useEffect } from "react";
import axios from "axios";

export default function PostReview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const token = localStorage.getItem("access_token");
  //       const response = await axios.get("https://jsonplaceholder.typicode.com/posts", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setPosts(response.data || []);
  //     } catch (error) {
  //       console.error("Failed to fetch posts!:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  // const handleAction = async (id, action) => {
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     const response = await axios.patch(
  //       `https://jsonplaceholder.typicode.com/posts/${id}`,
  //       { status: action },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setPosts((prev) =>
  //       prev.map((post) =>
  //         post.id === id ? { ...post, status: action } : post
  //       )
  //     );
  //   } catch (error) {
  //     console.log(`Error trying to ${action} the post!:`, error);
  //   }
  // };

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
          className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
          <p className="text-gray-800">{post.content}</p>

          <div className="flex justify-between items-center mt-3">
            <p className="flex items-center gap-2">
              Status:
              {post.status === "approved" && (
                <span className="text-green-600">✅ Approved</span>
              )}
              {post.status === "rejected" && (
                <span className="text-red-600">❌ Rejected</span>
              )}
              {!post.status && (
                <span className="text-gray-600">⏳ Pending</span>
              )}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleAction(post.id, "approved")}
                disabled={post.status}
                className={`px-4 py-1 rounded ${
                  post.status
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(post.id, "rejected")}
                disabled={post.status}
                className={`px-4 py-1 rounded ${
                  post.status
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
