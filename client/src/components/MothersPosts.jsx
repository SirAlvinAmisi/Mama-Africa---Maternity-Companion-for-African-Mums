import React from 'react';

function MothersPost({ posts }) {
  return (
  <div className="bg-white p-6 rounded-md shadow-md">
    <h2 className="text-2xl font-semibold mb-4 text-cyan-700">Mothers Post</h2>
    {posts.map((post, index) => (
      <div key={index} className="mb-4">
        <h4 className="text-lg font-semibold text-gray-600">{post.author}</h4>
        <p className="text-gray-600 font-medium">{post.content}</p>
        <button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold transition">
          VIEW
        </button>
      </div>
    ))}
  </div>
);

}

export default MothersPost;
