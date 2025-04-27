import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-cyan-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-black">
          Mama Afrika
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 text-black font-medium">
          <Link to="/" className="hover:text-cyan-600 transition-colors duration-300">Home</Link>
          <Link to="/health-professional" className="hover:text-cyan-600 transition-colors duration-300">Specialists</Link>
          <Link to="/communities" className="hover:text-cyan-600 transition-colors duration-300">Communities</Link>
          <Link to="/login" className="hover:text-cyan-600 transition-colors duration-300">Login | Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
