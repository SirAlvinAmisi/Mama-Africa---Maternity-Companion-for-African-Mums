import React from 'react';
import { Link } from 'react-router-dom';

function BabyCorner() {
  return (
    // <div className="bg-white p-6 rounded-lg shadow-lg text-center">
    <div className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-300 p-8 rounded-lg shadow-lg text-center text-cyan-900">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
       Nutrition <span className="text-cyan-900">Corner</span>
      </h2>

      <img 
        src="https://i.pinimg.com/736x/b9/5a/5d/b95a5da1c3f24df59a06e1d28a3a6836.jpg" 
        alt="Baby Corner" 
        className="w-full h-50 sm:h-52 object-cover object-center rounded-xl shadow-md hover:shadow-lg transition duration-300"
      />

      <p className="text-black font-bold mt-4 mb-6">
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
