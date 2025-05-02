import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    bio: '',
    role: '',
    licenseNumber: '',
    county: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password)) {
      alert("Password must contain both uppercase and lowercase letters.");
      return;
    }
    

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("first_name", formData.firstName);
      payload.append("middle_name", formData.middleName);
      payload.append("last_name", formData.lastName);
      payload.append("bio", formData.bio);
      payload.append("role", formData.role);
      if (formData.role === "Health Professional") {
        payload.append("license_number", formData.licenseNumber);
      }
      payload.append("county", formData.county);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      if (avatar) {
        payload.append("avatar", avatar);
      }

      const response = await axios.post('http://localhost:5000/signup', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("Signup successful! Please check your email to verify.");
      navigate('/login');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-2">Sign Up</h2>
      <p className="text-center text-gray-500 mb-6">Join Mama Afrika Community</p>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title */}
        <select name="title" onChange={handleChange} className="p-3 border rounded-md text-base">
          <option value="">Select Title</option>
          <option value="Miss">Miss</option>
          <option value="Mrs">Mrs</option>
          <option value="Mr">Mr</option>
          <option value="Dr">Dr</option>
        </select>

        {/* Names */}
        <input name="firstName" onChange={handleChange} type="text" placeholder="First Name" className="p-3 border rounded-md text-base"/>
        <input name="middleName" onChange={handleChange} type="text" placeholder="Middle Name (Optional)" className="p-3 border rounded-md text-base"/>
        <input name="lastName" onChange={handleChange} type="text" placeholder="Last Name" className="p-3 border rounded-md text-base"/>

        {/* Short Bio */}
        <textarea name="bio" onChange={handleChange} placeholder="Short Bio" className="p-3 border rounded-md text-base h-24"/>

        {/* Role */}
        <select name="role" onChange={handleChange} value={formData.role} className="p-3 border rounded-md text-base">
          <option value="">Select Role</option>
          <option value="Mom">Mom</option>
          <option value="Health Professional">Health Professional</option>
          <option value="Admin">Admin</option>
        </select>

        {/* License number if Health Professional */}
        {formData.role === "Health Professional" && (
          <input name="licenseNumber" onChange={handleChange} type="text" placeholder="License Number (for Doctors)" className="p-3 border rounded-md text-base"/>
        )}
        <select
          name="county"
          onChange={handleChange}
          className="p-3 border rounded-md text-base"
        >
          <option value="">Select County</option>
          {[
            "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", "Kajiado",
            "Eldoret", "Kakamega", "Meru", "Bungoma", "Nyeri", "Murang'a", "Nanyuki",
            "Kisii", "Kericho", "Bomet", "Embu", "Kitui", "Ol Kalou", "Siaya", "Homa Bay",
            "Migori", "Kapsabet", "Kitale", "Lodwar", "Garissa", "Wajir", "Mandera", "Isiolo",
            "Marsabit", "Tana River", "Lamu", "Kilifi", "Taita Taveta", "Kwale", 
            "Nyamira", "Thika", "Nyandarua", "Laikipia", "Narok", "Naivasha"
          ].map((county) => (
            <option key={county} value={county}>{county}</option>
          ))}
        </select>

        {/* Email & Password */}
        <input name="email" onChange={handleChange} type="email" placeholder="Email Address" className="p-3 border rounded-md text-base"/>
        <input name="password" onChange={handleChange} type="password" placeholder="Password" className="p-3 border rounded-md text-base"/>
        <input name="confirmPassword" onChange={handleChange} type="password" placeholder="Confirm Password" className="p-3 border rounded-md text-base"/>

        {/* Avatar Upload */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Upload Avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="p-2 border rounded-md"/>
          {avatarPreview && (
            <img src={avatarPreview} alt="Avatar Preview" className="mt-4 w-32 h-32 rounded-full object-cover mx-auto shadow-md"/>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="p-3 bg-cyan-600 text-white rounded-md text-base hover:bg-cyan-700 transition">
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
