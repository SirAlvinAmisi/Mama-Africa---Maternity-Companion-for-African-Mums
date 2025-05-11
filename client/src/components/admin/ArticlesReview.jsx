import { useState, useEffect } from "react";
import axios from "axios";

export default function ArticlesReview() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles from the backend
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:5000/admin/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      alert("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle actions: approve, delete, or flag
  const handleAction = async (id, action) => {
  try {
    const token = localStorage.getItem("access_token");
    let endpoint = "";
    let method = "PATCH";

    if (action === "approved") {
      endpoint = `/admin/approve_article/${id}`;
    } else if (action === "flagged") {
      endpoint = `/admin/flag_article/${id}`;
    } else if (action === "deleted") {
      endpoint = `/admin/delete_article/${id}`;
      method = "DELETE";
    }

    await axios({
      method,
      url: `http://localhost:5000${endpoint}`,
      headers: { Authorization: `Bearer ${token}` }
    });

    // Frontend state update after server success
    setArticles((prev) =>
      prev
        .map((article) => {
          if (article.id === id) {
            if (action === "flagged") return { ...article, is_flagged: true };
            if (action === "approved") return { ...article, is_approved: true };
            if (action === "deleted") return null;
          }
          return article;
        })
        .filter(Boolean)
    );

    alert(`Article ${action} successfully`);
  } catch (error) {
    console.error(`Failed to ${action} article ${id}:`, error);
    alert(`Failed to ${action} article`);
  }
};

  // const handleAction = (id, action) => {
  //   setArticles((prev) =>
  //     prev.map((article) => {
  //       if (article.id === id) {
  //         if (action === "flagged") {
  //           return { ...article, is_flagged: true };
  //         } else if (action === "approved") {
  //           return { ...article, is_approved: true };
  //         } else if (action === "deleted") {
  //           return null; // Mark for deletion
  //         }
  //       }
  //       return article;
  //     }).filter(Boolean) // Remove deleted articles
  //   );
  //   alert(`Article ${action} successfully`);
  // };

  if (loading) return <p>Loading Articles...</p>;
  if (articles.length === 0) return <p>No articles available for review.</p>;

  return (
    <div className="space-y-4 bg-cyan-200 text-black p-4 rounded-lg shadow-md">
      {articles.map((article) => (
        <div key={article.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-cyan-500">
          <h3 className="text-lg font-bold text-black">{article.title}</h3>
          <p className="text-gray-600">{article.content}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm text-gray-700">
              Status:{" "}
              <span
                className={`font-semibold ${
                  article.is_approved
                    ? "text-green-600"
                    : article.is_flagged
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {article.is_approved
                  ? "Approved"
                  : article.is_flagged
                  ? "Flagged"
                  : "Pending"}
              </span>
            </p>
            <div className="flex gap-2">
              {/* Flag Button */}
              <button
                onClick={() => handleAction(article.id, "flagged")}
                className={`px-4 py-1 rounded ${
                  article.is_flagged
                    ? "bg-red-200 text-red-700 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-red-300"
                }`}
                disabled={article.is_flagged}
              >
                {article.is_flagged ? "🚩 Flagged" : "🚩 Flag"}
              </button>

              {/* Approve Button */}
              {!article.is_approved && (
                <button
                  onClick={() => handleAction(article.id, "approved")}
                  className="px-4 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Approve
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleAction(article.id, "deleted")}
                className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
