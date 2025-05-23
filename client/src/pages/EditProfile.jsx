import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUserProfile } from '../lib/api';

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    title: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    bio: '',
    region: ''
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        const profile = response.profile || {};

        setProfileData({
          title: profile.title || '',
          first_name: profile.first_name || '',
          middle_name: profile.middle_name || '',
          last_name: profile.last_name || '',
          bio: profile.bio || '',
          region: profile.region || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profileData);
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return <p className="text-center text-lg mt-12">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-cyan-700">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700 text-lg">
        <input 
          type="text" 
          name="title" 
          placeholder="Title (Mr, Mrs, Dr, Miss)" 
          value={profileData.title} 
          onChange={handleChange} 
          className="p-3 border rounded-md"
        />
        <input 
          type="text" 
          name="first_name" 
          placeholder="First Name" 
          value={profileData.first_name} 
          onChange={handleChange} 
          className="p-3 border rounded-md"
        />
        <input 
          type="text" 
          name="middle_name" 
          placeholder="Middle Name (Optional)" 
          value={profileData.middle_name} 
          onChange={handleChange} 
          className="p-3 border rounded-md"
        />
        <input 
          type="text" 
          name="last_name" 
          placeholder="Last Name" 
          value={profileData.last_name} 
          onChange={handleChange} 
          className="p-3 border rounded-md"
        />
        <textarea 
          name="bio" 
          placeholder="Short Bio" 
          value={profileData.bio} 
          onChange={handleChange} 
          className="p-3 border rounded-md h-24"
        />
        <input 
          type="text" 
          name="region" 
          placeholder="Region / County" 
          value={profileData.region} 
          onChange={handleChange} 
          className="p-3 border rounded-md"
        />

        <button 
          type="submit" 
          className="bg-cyan-600 text-white px-6 py-3 rounded hover:bg-cyan-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
