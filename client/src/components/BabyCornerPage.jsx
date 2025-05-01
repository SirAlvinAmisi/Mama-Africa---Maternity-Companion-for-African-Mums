import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BabyCornerPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/baby-articles'); // Custom API later
        setArticles(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching baby articles:', error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">Baby Corner</h1>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600">{article.content.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No articles posted yet. Check back soon!</p>
      )}
    </div>
  );
};

export default BabyCornerPage;
