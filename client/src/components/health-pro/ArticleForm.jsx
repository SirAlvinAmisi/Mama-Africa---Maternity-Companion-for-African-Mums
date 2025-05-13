import React, { useState } from 'react';

export default function ArticleForm({ onSubmit }) {
  const [article, setArticle] = useState({
    title: '',
    category: 'Nutrition',
    content: ''
  });

  const categories = ['Nutrition', 'Pregnancy Tips', 'Checkup Guidelines', 'Mental Health'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(article);
    setArticle({ title: '', category: 'Nutrition', content: '' });
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
      <input
        type="text"
        value={article.title}
        onChange={(e) => setArticle({ ...article, title: e.target.value })}
        className="w-full border rounded p-2 bg-white text-gray-700"
        placeholder="Enter article title"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
      <select
        value={article.category}
        onChange={(e) => setArticle({ ...article, category: e.target.value })}
        className="w-full border rounded p-2 bg-white text-gray-700"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">Content</label>
      <textarea
        value={article.content}
        onChange={(e) => setArticle({ ...article, content: e.target.value })}
        rows="5"
        className="w-full border rounded p-2 bg-white text-gray-700"
        required
      />
    </div>

    <button
      type="submit"
      className="px-4 py-2 bg-cyan-300 text-black font-medium rounded hover:bg-cyan-400"
    >
      Publish Article
    </button>
  </form>
);
}