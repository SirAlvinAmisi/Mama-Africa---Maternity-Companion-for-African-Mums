import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NutritionDashboard() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('/api/nutrition-blogs')
      .then(response => {
        setBlogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching nutrition blogs:', error);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700 text-center">
        Nutrition <span className="text-cyan-500">Corner</span>
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        Tips and advice on nutrition during pregnancy and postpartum!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <img src={blog.image_url} alt={blog.title} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-lg font-semibold text-cyan-700 mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-600 mb-2">By {blog.author} | {blog.category}</p>
            <p className="text-gray-700 text-sm mb-4">{blog.content.slice(0, 100)}...</p>
            {/* You can link to a detailed view if needed */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NutritionDashboard;
