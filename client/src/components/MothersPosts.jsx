import React from 'react';

function MothersPost({ posts }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">Mothers Post</h2>
      {posts.map((post, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-semibold">{post.author}</h4>
          <p className="text-gray-700">{post.content}</p>
          <button className="mt-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">
            VIEW
          </button>
        </div>
      ))}
    </div>
  );
}

export default MothersPost;
