import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', {
        email,
        password
      });

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);

      const userResponse = await api.get('/me');
      const user = userResponse.data;

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
    <div className="max-w-md mx-auto mt-20 mb-20 px-6 sm:px-10 py-10 bg-cyan-100 rounded-md shadow-md">
      <h2 className="text-gray-700 text-2xl sm:text-3xl font-semibold text-center mb-4">Login</h2>
      <p className="text-sm text-center text-gray-700 font-medium mb-6">Welcome back to Mama Afrika</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="email" placeholder="Email Address" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="p-3 border border-cyan-200 rounded-md text-sm sm:text-base text-gray-600 bg-white" />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="p-3 border border-cyan-200 rounded-md text-sm sm:text-base text-gray-600 bg-white" />

        <button type="submit"
          className="p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-base font-semibold transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
