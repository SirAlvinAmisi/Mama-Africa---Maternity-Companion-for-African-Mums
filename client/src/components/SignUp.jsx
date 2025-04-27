import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-2">Sign Up</h2>
      <p className="text-center text-gray-500 mb-6">Join Mama Afrika Community</p>
      
      <form className="flex flex-col gap-4">
        {/* Title */}
        <select className="p-3 border rounded-md text-base">
          <option value="">Select Title</option>
          <option value="Miss">Miss</option>
          <option value="Mrs">Mrs</option>
          <option value="Mr">Mr</option>
          <option value="Dr">Dr</option>
        </select>

        {/* Names */}
        <input 
          type="text" 
          placeholder="First Name" 
          className="p-3 border rounded-md text-base"
        />
        <input 
          type="text" 
          placeholder="Middle Name (Optional)" 
          className="p-3 border rounded-md text-base"
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          className="p-3 border rounded-md text-base"
        />

        {/* Short Bio */}
        <textarea 
          placeholder="Short Bio" 
          className="p-3 border rounded-md text-base h-24"
        />

        {/* Role Dropdown */}
        <select 
          className="p-3 border rounded-md text-base"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Mom">Mom</option>
          <option value="Health Professional">Health Professional</option>
          <option value="Admin">Admin</option>
        </select>

        {/* License Number if Health Professional */}
        {role === "Health Professional" && (
          <input 
            type="text" 
            placeholder="License Number (for Doctors)" 
            className="p-3 border rounded-md text-base"
          />
        )}

        {/* Email */}
        <input 
          type="email" 
          placeholder="Email Address" 
          className="p-3 border rounded-md text-base"
        />

        {/* Password */}
        <input 
          type="password" 
          placeholder="Password" 
          className="p-3 border rounded-md text-base"
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          className="p-3 border rounded-md text-base"
        />

        {/* Avatar Upload */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Upload Avatar</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange}
            className="p-2 border rounded-md"
          />
          {/* Avatar Preview */}
          {avatarPreview && (
            <img 
              src={avatarPreview} 
              alt="Avatar Preview" 
              className="mt-4 w-32 h-32 rounded-full object-cover mx-auto shadow-md"
            />
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="p-3 bg-cyan-600 text-white rounded-md text-base hover:bg-cyan-700 transition"
        >
          Sign Up
        </button>

        {/* Already have account */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-600 hover:underline font-semibold">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Signup;
