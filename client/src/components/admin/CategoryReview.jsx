import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoryReview() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:5000/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post(
        'http://localhost:5000/admin/categories',
        { name: newCategory.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(prev => [...prev, res.data.category]);
      setNewCategory('');
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading){
    return <p>Loading categories...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Categories</h2>
      <div className="flex gap-2 mb-6">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addCategory}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded"
          >
            <span>{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
