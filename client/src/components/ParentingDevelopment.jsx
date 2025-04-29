import React from 'react';
import { Link } from 'react-router-dom';

function ParentingDevelopment() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Parenting and <span className="text-cyan-500">Development</span>
      </h2>
      
      <img 
        src="https://i.pinimg.com/736x/bb/9e/43/bb9e4325e6a1957cfb0ce02c76ba08ee.jpg" 
        alt="Parenting" 
        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition"
      />

      <p className="text-gray-600 mt-4 mb-6">
        Explore articles, tips, and guides for your parenting journey!
      </p>

      {/* Explore Button */}
      <Link to="/parenting-development">
        <button className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition">
          Explore
        </button>
      </Link>
    </div>
  );
}

export default ParentingDevelopment;
