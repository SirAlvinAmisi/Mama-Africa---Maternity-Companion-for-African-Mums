import React, { useState } from 'react';
import axios from 'axios';

export default function PostForm({ communityId, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    try {
      await axios.post(`http://localhost:5000/communities/${communityId}/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setContent('');
      onSuccess?.();
    } catch (err) {
      console.error("Post failed", err);
      alert("Could not create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Create New Post</h3>
      <input
        className="w-full p-2 border rounded mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        required
      />
      <textarea
        className="w-full p-2 border rounded mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        required
      />
      <button className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700" type="submit">
        Post
      </button>
    </form>
  );
}
