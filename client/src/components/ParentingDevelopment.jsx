import React from 'react';

function ParentingDevelopment() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Parenting and <span className="text-cyan-500">Development</span>
      </h2>
      <div className="w-full">
        <img 
          src="https://i.pinimg.com/736x/bb/9e/43/bb9e4325e6a1957cfb0ce02c76ba08ee.jpg" 
          alt="Parenting" 
          className="w-full h-64 object-contain rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}

export default ParentingDevelopment;
