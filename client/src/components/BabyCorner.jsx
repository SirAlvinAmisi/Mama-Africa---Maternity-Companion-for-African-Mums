import React from 'react';
import { Link } from 'react-router-dom';

function BabyCorner() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Baby <span className="text-cyan-500">Corner</span>
      </h2>

      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZmYsjo8t1K8r6L7KO5Uqs5kLIrZ18bSwM5Qac5ROnKVOAgzL5L9s-JnvmCFMBOOkARow&usqp=CAU" 
        alt="Baby Corner" 
        className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition"
      />

      <p className="text-gray-600 mt-4 mb-6">
        Tips, advice, and milestones for your little one's growth!
      </p>

      {/* Explore Button */}
      <Link to="/baby-corner">
        <button className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition">
          Explore
        </button>
      </Link>
    </div>
  );
}

export default BabyCorner;
