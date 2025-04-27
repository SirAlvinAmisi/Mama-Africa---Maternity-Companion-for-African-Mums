import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cyan-100 p-8 w-full relative">
      <div className="flex justify-between max-w-screen-xl mx-auto flex-wrap">
        
        <div className="flex flex-col gap-2 min-w-[200px] mr-4 mb-4">
          <Link to="/" className="text-gray-800 text-sm hover:underline">Home</Link>
          <Link to="/specialists" className="text-gray-800 text-sm hover:underline">Specialist</Link>
          <Link to="/communities" className="text-gray-800 text-sm hover:underline">Communities</Link>
          <Link to="/about" className="text-gray-800 text-sm hover:underline">About Us</Link>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px] mr-4 mb-4">
          <Link to="/community-guidelines" className="text-gray-800 text-sm hover:underline">Community Guidelines</Link>
          <Link to="/privacy" className="text-gray-800 text-sm hover:underline">Data Privacy Policy</Link>
          <Link to="/help-center" className="text-gray-800 text-sm hover:underline">Help Center</Link>
          <Link to="/popular-topics" className="text-gray-800 text-sm hover:underline">Popular Topics</Link>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px] mb-4">
          <Link to="/terms" className="text-gray-800 text-sm hover:underline">Terms & Conditions</Link>
          <div className="text-gray-800 text-sm">info@mamaafrika.com</div>
        </div>

      </div>

      <div className="flex justify-center gap-4 mt-4">
        {/* Placeholder social icons */}
        <div className="w-[30px] h-[30px] bg-gray-300 rounded-full"></div>
        <div className="w-[30px] h-[30px] bg-gray-300 rounded-full"></div>
        <div className="w-[30px] h-[30px] bg-gray-300 rounded-full"></div>
      </div>

      <div className="text-center mt-8 text-xs text-gray-500">
        <p>Mama 🌍frika. All rights reserved.</p>
        <p>Mama 🌍frika is designed for educational purposes only. Consult with a medical professional if you have health concerns.</p>
      </div>
    </footer>
  );
};

export default Footer;
