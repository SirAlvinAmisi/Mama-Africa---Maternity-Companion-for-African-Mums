import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleById } from '../../lib/api'; 

export const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getArticleById(id); // ✅ Use centralized API call
        setArticle(fetchedArticle);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!article) {
    return <div className="flex justify-center items-center h-screen">Article not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
      <div className="flex justify-between text-gray-500 mb-6">
        <span>Category: {article.category}</span>
        <span>{new Date(article.created_at).toLocaleDateString()}</span>
      </div>
      <div className="prose max-w-full">
        {article.content}
      </div>
    </div>
  );
};
