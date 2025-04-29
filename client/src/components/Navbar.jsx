// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-cyan-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-black mb-4 md:mb-0">
          Mama 🌍frika
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-black font-medium items-center">
          <Link to="/" className="hover:text-cyan-600 transition-colors duration-300">Home</Link>
          <Link to="/specialists" className="hover:text-cyan-600 transition-colors duration-300">Specialists</Link>
          <Link to="/communities" className="hover:text-cyan-600 transition-colors duration-300">Communities</Link>
          <Link to="/signup" className="hover:text-cyan-600 transition-colors duration-300">Signup</Link>
          <Link to="/login" className="hover:text-cyan-600 transition-colors duration-300">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
