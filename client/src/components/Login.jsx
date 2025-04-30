import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);

      // Fetch user profile
      const userResponse = await axios.get('http://localhost:5000/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const user = userResponse.data;
      console.log("Fetched user from /me:", user);

      const role = user.role.toLowerCase().replace(/\s+/g, '_'); // Normalize role to lowercase

      // Save role in localStorage if needed later
      localStorage.setItem('role', role);

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'mum') {
        navigate('/mom');
      } else if (role === 'health_professional') {
        navigate('/healthpro/dashboard');
      } else {
        navigate('/home'); // fallback
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded-md text-base"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded-md text-base"
        />
        <button type="submit" className="p-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
