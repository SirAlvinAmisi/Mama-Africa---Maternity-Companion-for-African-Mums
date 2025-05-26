import React, { useState } from 'react';
import { createCommunity } from '../../lib/api';

const CreateCommunity = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCommunity({ name, description, image });
      alert('🎉 Community created!');
      setName('');
      setDescription('');
      setImage('');
    } catch (error) {
      alert('Failed to create community');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="bg-cyan-300 text-black max-w-xl mx-auto p-6 rounded-xl shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-cyan-700">🫂 Create a New Community</h2>

      <input
        type="text"
        placeholder="Community Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        required
      />

      <textarea
        placeholder="Brief Description (Why join?)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <input
        type="text"
        placeholder="Image URL (Optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
      >
        ✅ Create Community
      </button>
    </form>
  );
};

export default CreateCommunity;
