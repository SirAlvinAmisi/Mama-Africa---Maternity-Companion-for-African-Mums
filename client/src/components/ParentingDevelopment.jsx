import React from 'react';
import { Link } from 'react-router-dom';

function ParentingDevelopment() {
  return (
    // <div className="bg-white p-6 rounded-lg shadow-lg text-center">
    <div className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-300 p-8 rounded-lg shadow-lg text-center text-cyan-900">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Parenting and <span className="text-cyan-900">Development</span>
      </h2>
      
      <img 
        src="https://i.pinimg.com/736x/7c/9d/09/7c9d09770bbafe7dac966b355ba6f930.jpg" 
        alt="Parenting" 
        className="w-full h-50 sm:h-52 object-cover object-center rounded-xl shadow-md hover:shadow-lg transition duration-300"


      />

      <p className="text-black font-bold mt-4 mb-6">
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
