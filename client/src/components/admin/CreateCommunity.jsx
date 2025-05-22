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
      alert('Community created!');
      setName('');
      setDescription('');
      setImage('');
    } catch (error) {
      alert('Failed to create community');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4 bg-cyan-200 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold text-cyan-900">Create Community</h2>
      <input
        type="text"
        placeholder="Community Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border text-black p-2 w-full rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 text-black w-full rounded"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="border text-black p-2 w-full rounded"
      />
      <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
};

export default CreateCommunity;
