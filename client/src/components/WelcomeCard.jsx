import React from 'react';

function Welcome() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4 text-cyan-700">
        Welcome to the <span className="text-cyan-500">community</span>
      </h2>
      <img 
        src="https://i.pinimg.com/736x/fa/de/c9/fadec944daf81a77359dbd3ad2b10026.jpg" 
        alt="Welcome" 
        className="w-full h-90 object-contain rounded-lg shadow-md"
      />
    </div>
  );
}

export default Welcome;
