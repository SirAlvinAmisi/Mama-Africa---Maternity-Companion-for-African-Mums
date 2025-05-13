import { useState } from 'react';
import axios from 'axios';

export default function MomRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/mums/register', { email, password });
      setMsg('Registered! Please log in.');
    } catch (e) {
      setMsg(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <h2 className="text-2xl font-semibold text-gray-600">Mum Registration</h2>

    <input
      type="email"
      required
      placeholder="Email"
      className="w-full p-3 border border-cyan-200 rounded-md bg-white text-gray-600"
      value={email}
      onChange={e => setEmail(e.target.value)}
    />

    <input
      type="password"
      required
      placeholder="Password"
      className="w-full p-3 border border-cyan-200 rounded-md bg-white text-gray-600"
      value={password}
      onChange={e => setPassword(e.target.value)}
    />

    <button
      type="submit"
      className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md font-semibold"
    >
      Register
    </button>

    {msg && <p className="text-green-600 font-medium mt-2">{msg}</p>}
  </form>
);
}
