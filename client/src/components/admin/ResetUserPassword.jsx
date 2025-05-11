import React, { useState } from 'react';
import axios from 'axios';

const ResetUserPassword = () => {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/admin/reset_password', {
        email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Reset email sent!');
      setEmail('');
    } catch (error) {
      alert('Failed to reset password');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-4 bg-cyan-200 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold text-cyan-900">Reset User Password</h2>
      <input
        type="email"
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border text-black p-2 w-full rounded"
        required
      />
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
        Send Reset
      </button>
    </form>
  );
};

export default ResetUserPassword;
