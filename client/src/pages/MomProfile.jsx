import { useState } from 'react';
import axios from 'axios';

export default function MomProfile() {
  const [fullName, setFullName] = useState('');
  const [region, setRegion]   = useState('');
  const [bio, setBio]         = useState('');
  const [msg, setMsg]         = useState('');

  const token = localStorage.getItem('token');
  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/mom',
        { full_name: fullName, region, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Profile saved!');
    } catch (e) {
      setMsg('Error saving profile');
    }
  };

  return (
  <form onSubmit={submit} className="space-y-4">
    <h2 className="text-2xl font-semibold text-gray-600">Update Profile</h2>

    <input
      placeholder="Full Name"
      className="w-full p-3 border border-cyan-200 rounded-md bg-white text-gray-600"
      value={fullName}
      onChange={e => setFullName(e.target.value)}
    />

    <input
      placeholder="Region"
      className="w-full p-3 border border-cyan-200 rounded-md bg-white text-gray-600"
      value={region}
      onChange={e => setRegion(e.target.value)}
    />

    <textarea
      placeholder="Short bio"
      className="w-full p-3 border border-cyan-200 rounded-md bg-white text-gray-600"
      value={bio}
      onChange={e => setBio(e.target.value)}
      rows={3}
    />

    <button
      type="submit"
      className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md font-semibold"
    >
      Save
    </button>

    {msg && <p className="text-green-600 font-medium mt-2">{msg}</p>}
  </form>
);
}
