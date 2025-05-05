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

      localStorage.setItem('user', JSON.stringify(user));

      const role = user.role.toLowerCase().replace(/\s+/g, '_');
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin');
      } else if (['mom', 'mum'].includes(role)) {
        navigate('/mom');
      } else if (role === 'health_pro') {
        navigate('/healthpro/dashboard');
      } else {
        navigate('/home');
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6 sm:px-10 py-10 bg-cyan-400 rounded-2xl shadow-lg">
      <h2 className="text-cyan-900 text-2xl sm:text-3xl font-bold text-center mb-4">Login</h2>
      <p className="text-sm text-center text-cyan-900 font-semibold mb-6">Welcome back to Mama Afrika</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded-md text-sm sm:text-base text-black bg-cyan-300"
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded-md text-sm sm:text-base text-black bg-cyan-300"
          required
        />
        <button 
          type="submit" 
          className="p-3 bg-cyan-600 text-white rounded-md text-base hover:bg-cyan-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
