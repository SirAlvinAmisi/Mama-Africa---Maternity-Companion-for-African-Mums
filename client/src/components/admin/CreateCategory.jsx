import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory } from '../../lib/api'; 

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(); // ✅ Use centralized API function
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name }); // ✅ Use centralized API function
      alert('Category created!');
      setName('');
      loadCategories(); // Refresh list
    } catch (error) {
      alert('Failed to create category');
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="space-y-4 bg-cyan-200 p-4 rounded shadow-md">
        <h2 className="text-xl font-bold text-cyan-700">Create Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border text-black p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mt-6">Existing Categories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories created yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-800 mt-2">
            {categories.map((cat) => (
              <li key={cat.id}>{cat.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateCategory;
