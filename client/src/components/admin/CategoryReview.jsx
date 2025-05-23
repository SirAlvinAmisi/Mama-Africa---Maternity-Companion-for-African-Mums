import React, { useEffect, useState } from 'react';
import {
  fetchCategories,
  addCategory,
  deleteCategory
} from '../../lib/api'; 

export default function CategoryReview() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(); // ✅ Use API function
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const newCat = await addCategory({ name: newCategory.trim() }); // ✅ Use API function
      setCategories(prev => [...prev, newCat]);
      setNewCategory('');
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id); // ✅ Use API function
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
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
          onClick={handleAddCategory}
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
              onClick={() => handleDeleteCategory(cat.id)}
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
