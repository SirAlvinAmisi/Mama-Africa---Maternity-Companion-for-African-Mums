import React from 'react';
import { Link } from 'react-router-dom';

function BabyCorner() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
       Nutrition <span className="text-cyan-500">Corner</span>
      </h2>

      <img 
        src="https://i.pinimg.com/736x/b9/5a/5d/b95a5da1c3f24df59a06e1d28a3a6836.jpg" 
        alt="Baby Corner" 
        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition"
      />

      <p className="text-gray-600 mt-4 mb-6">
        Tips, advice, and all things nutrition!
      </p>

      {/* Explore Button */}
      <Link to="/nutrition-dashboard">
        <button className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition">
          Explore
        </button>
      </Link>
    </div>
  );
}

export default BabyCorner;
