import { useState, useEffect } from "react";
import axios from "axios";

export default function ArticleReview() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:5000/admin/articles/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArticles(response.data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://localhost:5000/admin/articles/${id}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, status: action } : post
        )
      );
    } catch (error) {
      console.error(`Error trying to ${action} article:`, error);
    }
  };

  if (loading) {
    return <p>Loading Articles...</p>;
  }

  if (articles.length === 0) {
    return <p>No articles to be reviewed!</p>;
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div key={article.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
          <p className="text-gray-600">{article.content}</p>
            <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => handleAction(article.id, "approved")} className="px-4 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Approve</button>
                <button onClick={() => handleAction(article.id, "rejected")} className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Reject</button>
                <p>Status: <strong>{post.status || "pending"}</strong></p>
            </div>
        </div>
      ))}
    </div>
  );
}
