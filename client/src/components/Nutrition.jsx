import React from 'react';
import { Link } from 'react-router-dom';

function Nutrition() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Nutrition <span className="text-cyan-500">Corner</span>
      </h2>

      <img 
        src="https://s3.amazonaws.com/images.icliniq.com/infographics/nutrients-during-pregnancy.jpg" 
        alt="Nutrition Corner" 
        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition"
      />

      <p className="text-gray-600 mt-4 mb-6">
        Tips and advice on nutrition during pregnancy and postpartum!
      </p>

      {/* Explore Button */}
      <Link to="/nutrition">
        <button className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition">
          Explore
        </button>
      </Link>
    </div>
  );
}

export default Nutrition;
