import React, { useState } from 'react';
import ArticleForm from './ArticleForm';
import ScanUpload from './ScanUpload';

const mockArticles = [
  {
    id: 1,
    title: "Nutrition During Pregnancy",
    category: "Nutrition",
    content: "Essential vitamins and minerals for expecting mothers...",
    date: "2023-10-15"
  }
];

export default function ContentManagement() {
  const [articles, setArticles] = useState(mockArticles);
  const [activeTab, setActiveTab] = useState('articles');

  const handleNewArticle = (newArticle) => {
    setArticles([...articles, { ...newArticle, id: articles.length + 1, date: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Management</h2>
      
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === 'articles' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('articles')}
        >
          Articles
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'scans' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('scans')}
        >
          Scan Samples
        </button>
      </div>

      {activeTab === 'articles' ? (
        <>
          <ArticleForm onSubmit={handleNewArticle} />
          <div className="mt-6">
            <h3 className="font-medium mb-2">Published Articles</h3>
            {articles.length > 0 ? (
              <ul className="space-y-3">
                {articles.map(article => (
                  <li key={article.id} className="p-3 border rounded hover:bg-gray-50">
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-gray-600">{article.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No articles published yet</p>
            )}
          </div>
        </>
      ) : (
        <ScanUpload />
      )}
    </div>
  );
}