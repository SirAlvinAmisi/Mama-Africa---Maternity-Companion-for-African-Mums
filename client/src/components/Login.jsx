import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
      <p className="text-center text-gray-500 mb-6">Welcome back to Mama Afrika</p>
      
      <form className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email Address" 
          className="p-3 border rounded-md text-base"
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="p-3 border rounded-md text-base"
        />
        <button 
          type="submit" 
          className="p-3 bg-cyan-600 text-white rounded-md text-base hover:bg-cyan-700"
        >
          Login
        </button>
        {/* Already have account */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-600 hover:underline font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
