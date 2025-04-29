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
      <h2 className="text-2xl font-semibold">Mum Registration</h2>
      <input
        type="email" required placeholder="Email"
        className="w-full p-3 border rounded"
        value={email} onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password" required placeholder="Password"
        className="w-full p-3 border rounded"
        value={password} onChange={e => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-button text-white px-6 py-2 rounded font-inria"
      >
        Register
      </button>
      {msg && <p className="text-green mt-2">{msg}</p>}
    </form>
  );
}
