import React, { useState } from 'react';
import { resetUserPassword } from '../../lib/api';

const ResetUserPassword = () => {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetUserPassword(email);
      alert('📩 Reset email sent!');
      setEmail('');
    } catch (error) {
      alert('❌ Failed to reset password');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="bg-cyan-300 text-black max-w-md mx-auto p-6 rounded-xl shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-red-600">🔐 Reset User Password</h2>

      <input
        type="email"
        placeholder="Enter User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        required
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
      >
        🚀 Send Reset Link
      </button>
    </form>
  );
};

export default ResetUserPassword;
