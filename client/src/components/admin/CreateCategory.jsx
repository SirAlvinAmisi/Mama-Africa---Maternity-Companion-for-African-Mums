import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:5000/admin/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/admin/create_category', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Category created!');
      setName('');
      fetchCategories(); // Refresh list
    } catch (error) {
      alert('Failed to create category');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
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

      {/* List of categories */}
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
