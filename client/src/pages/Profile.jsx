import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const profile = user.profile || {};

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-cyan-700">My Profile</h2>

      {profile.profile_picture && (
        <div className="flex justify-center mb-6">
          <img 
            src={`http://localhost:5000${profile.profile_picture}`} 
            alt="Profile Avatar" 
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 text-gray-700 text-lg">
        <div><strong>Title:</strong> {profile.title || 'N/A'}</div>
        <div><strong>First Name:</strong> {profile.first_name || 'N/A'}</div>
        <div><strong>Middle Name:</strong> {profile.middle_name || 'N/A'}</div>
        <div><strong>Last Name:</strong> {profile.last_name || 'N/A'}</div>
        <div><strong>Short Bio:</strong> {profile.bio || 'N/A'}</div>
        {profile.license_number && (
          <div><strong>License Number:</strong> {profile.license_number}</div>
        )}
        <div><strong>Region:</strong> {profile.region || 'N/A'}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        <div><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6">
        <button 
          onClick={() => navigate('/profile/edit')}
          className="bg-cyan-600 text-white px-6 py-3 rounded hover:bg-cyan-700 transition"
        >
          Edit Profile
        </button>
      </div>
      {user.role && (
      <div className="mt-6 flex flex-col gap-3">
        {user.role.toLowerCase() === 'admin' && (
          <button 
            onClick={() => navigate('/admin')}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Back to Admin Dashboard
          </button>
        )}

        {user.role.toLowerCase() === 'mum' && (
          <button 
            onClick={() => navigate('/mom')}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Back to Mum Profile
          </button>
        )}

        {user.role.toLowerCase() === 'health_pro' && (
          <button 
            onClick={() => navigate('/healthpro')}
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Back to Health Professional Dashboard
          </button>
        )}
      </div>
    )}

    </div>
  );
};

export default Profile;
