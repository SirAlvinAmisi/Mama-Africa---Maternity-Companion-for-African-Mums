import { useState, useEffect } from "react";
import { getAdminArticles, handleArticleAction } from "../../lib/api";

export default function ArticlesReview() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const data = await getAdminArticles();
      setArticles(data.articles || []);
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

  const handleAction = async (id, action) => {
    try {
      await handleArticleAction(id, action);
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

  if (loading) return <p>Loading Articles...</p>;
  if (articles.length === 0) return <p>No articles available for review.</p>;

  return (
    <div className="space-y-4 bg-white text-black p-4 rounded-lg shadow-md">
      {articles.map((article) => (
        <div key={article.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-cyan-100">
          <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
          <p className="text-gray-700 font-medium">{article.content}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm text-gray-600 font-medium">
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
              <button
                onClick={() => handleAction(article.id, "flagged")}
                className={`px-4 py-1 rounded text-sm font-medium ${
                  article.is_flagged
                    ? "bg-red-200 text-red-700 cursor-not-allowed"
                    : "bg-gray-200 text-gray-800 hover:bg-red-300"
                }`}
                disabled={article.is_flagged}
              >
                {article.is_flagged ? "🚩 Flagged" : "🚩 Flag"}
              </button>

              {!article.is_approved && (
                <button
                  onClick={() => handleAction(article.id, "approved")}
                  className="px-4 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200"
                >
                  Approve
                </button>
              )}

              <button
                onClick={() => handleAction(article.id, "deleted")}
                className="px-4 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
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
