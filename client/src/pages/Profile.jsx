import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/api';

const normalizeRole = (role) => {
  if (!role) return '';
  const lower = role.toLowerCase().trim();
  if (lower === 'health professional') return 'health_pro';
  if (lower === 'admin') return 'admin';
  if (lower === 'mum') return 'mom';
  return lower.replace(/\s+/g, '_');
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  const profile = user.profile || {};
  const normalizedRole = normalizeRole(user.role);

  const dashboardRoutes = {
    admin: '/admin',
    mom: '/mom',
    health_pro: '/healthpro/dashboard'
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-cyan-700">My Profile</h2>

      {profile.profile_picture && (
        <div className="flex justify-center mb-6">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${profile.profile_picture}`}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 text-gray-700 text-lg">
        <div><strong>Full Name:</strong> {`${profile.first_name || ''} ${profile.middle_name || ''} ${profile.last_name || ''}`.trim()}</div>
        <div><strong>Short Bio:</strong> {profile.bio}</div>
        <div><strong>Region:</strong> {profile.region}</div>
        {profile.license_number && (
          <div><strong>License Number:</strong> {profile.license_number}</div>
        )}
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        <div><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/profile/edit')}
          className="bg-cyan-600 text-white px-6 py-3 rounded hover:bg-cyan-700 transition"
        >
          Edit Profile
        </button>
      </div>

      {dashboardRoutes[normalizedRole] && (
        <div className="mt-4">
          <button
            onClick={() => navigate(dashboardRoutes[normalizedRole])}
            className="bg-green-100 text-gray-800 px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Back to {normalizedRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
