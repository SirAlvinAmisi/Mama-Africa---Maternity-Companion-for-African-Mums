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

  if (loading) return <p className="text-center text-cyan-700 font-medium">Loading Articles...</p>;
  if (articles.length === 0) return <p className="text-center text-gray-600">No articles available for review.</p>;

  return (
    <div className="space-y-6 bg-white text-black p-4 sm:p-6 rounded-xl shadow-md">
      {articles.map((article) => (
        <div
          key={article.id}
          className="p-5 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-br from-cyan-50 to-white hover:shadow-lg transition duration-200"
        >
          <h3 className="text-xl font-semibold text-purple-800 mb-2">{article.title}</h3>
          <p className="text-gray-700 mb-4">{article.content}</p>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-sm font-medium text-gray-600">
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

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleAction(article.id, "flagged")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition duration-150 ${
                  article.is_flagged
                    ? "bg-red-200 text-red-800 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
                disabled={article.is_flagged}
              >
                {article.is_flagged ? "🚩 Flagged" : "🚩 Flag"}
              </button>

              {!article.is_approved && (
                <button
                  onClick={() => handleAction(article.id, "approved")}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition duration-150"
                >
                  ✅ Approve
                </button>
              )}

              <button
                onClick={() => handleAction(article.id, "deleted")}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition duration-150"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
