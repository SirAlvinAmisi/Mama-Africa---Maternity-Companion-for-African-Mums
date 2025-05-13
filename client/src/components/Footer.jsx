import React from 'react';
import { Link } from 'react-router-dom';
import facebookLogo from '../assets/facebook.png'
import instagramLogo from '../assets/instagram.png'
import twitterLogo from '../assets/twitter.png'

const Footer = () => {
  return (
    <footer className="bg-cyan-100 p-8 w-full relative">
      <div className="flex justify-between max-w-screen-xl mx-auto flex-wrap sm:flex-nowrap gap-6">

        {/* First Column */}
        <div className="flex flex-col gap-2 w-[250px] sm:w-[300px] lg:w-[200px] text-sm sm:text-base">
          <Link to="/" className="text-gray-800 hover:underline">Home</Link>
          <Link to="/specialists" className="text-gray-800 hover:underline">Specialist</Link>
          <Link to="/communities" className="text-gray-800 hover:underline">Communities</Link>
          <Link to="/about" className="text-gray-800 hover:underline">About Us</Link>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-2 w-[250px] sm:w-[300px] lg:w-[200px] text-sm sm:text-base">
          <Link to="/community-guidelines" className="text-gray-800 hover:underline">Community Guidelines</Link>
          <Link to="/privacy" className="text-gray-800 hover:underline">Data Privacy Policy</Link>
          <Link to="/help-center" className="text-gray-800 hover:underline">Help Center</Link>
          {/* <Link to="/topics" className="text-gray-800 hover:underline">Popular Topics</Link> */}
        </div>

        {/* Third Column */}
        <div className="flex flex-col gap-2 w-[250px] sm:w-[300px] lg:w-[200px] text-sm sm:text-base">
          <Link to="/terms" className="text-gray-800 hover:underline">Terms & Conditions</Link>
          <div className="text-gray-800">info@mamaafrika.com</div>
        </div>

      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-4 mt-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full">
      <img src={facebookLogo} alt="facebook logo" className="w-full h-full object-cover" />
      </div>
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full">
      <img src={instagramLogo} alt="instagram logo" className="w-full h-full object-cover" />
      </div>
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-300 rounded-full">
      <img src={twitterLogo} alt="twitter logo" className="w-full h-full object-cover" />
      </div>
      </div>


      {/* Footer Text */}
      <div className="text-center mt-8 text-xs text-gray-500">
        <p>Mama 🌍frika. All rights reserved.</p>
        <p>Mama 🌍frika is designed for educational purposes only. Consult with a medical professional if you have health concerns.</p>
      </div>
    </footer>
  );
};

export default Footer;
