import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api, { baseURL } from '../lib/api'; 

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    //  1. Role must be selected
    if (!formData.role) {
      alert("Please select a role.");
      return;
    }

    // 2. License format check if role is Health Professional
    if (formData.role === "Health Professional") {
      const licenseRegex = /^[a-zA-Z]{2,}\/\d{4}\/\d{3,10}$/;
      if (!licenseRegex.test(formData.licenseNumber)) {
        alert("License number format must be like ABC/2025/1234567");
        return;
      }

      const yearMatch = formData.licenseNumber.split("/")[1];
      const currentYear = new Date().getFullYear().toString();
      if (yearMatch !== currentYear) {
        alert(`Your license year (${yearMatch}) may be expired. Please provide a valid license.`);
        return;
      }
    }
    //3. Password format check
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

      // const response = await axios.post('http://localhost:5000/signup', payload, {
      const response = await api.post('/signup', payload, {  
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
  <div className="container max-w-3xl mx-auto mt-12 mb-20 px-4 sm:px-6 lg:px-8 py-8 bg-cyan-100 rounded-md shadow-md">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 text-center mb-2">Sign Up</h2>
    <p className="text-sm sm:text-base text-center font-medium text-gray-700 mb-6">Join Mama Afrika Community</p>

    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <select name="title" onChange={handleChange} className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium">
        <option value="">Select Title</option>
        <option value="Miss">Miss</option>
        <option value="Mrs">Mrs</option>
        <option value="Mr">Mr</option>
        <option value="Dr">Dr</option>
      </select>

      <input name="firstName" onChange={handleChange} type="text" placeholder="First Name" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" />
      <input name="middleName" onChange={handleChange} type="text" placeholder="Middle Name (Optional)" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" />
      <input name="lastName" onChange={handleChange} type="text" placeholder="Last Name" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" />

      <textarea name="bio" onChange={handleChange} placeholder="Short Bio" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium h-24 placeholder-gray-500" />

      <select name="role" onChange={handleChange} value={formData.role} className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium">
        <option value="" required>Select Role</option>
        <option value="Mom">Mom</option>
        <option value="Health Professional">Health Professional</option>
      </select>

      {formData.role === "Health Professional" && (
        <input name="licenseNumber" onChange={handleChange} type="text" placeholder="License Number (for Doctors)" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" />
      )}

      <select name="county" onChange={handleChange} className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium">
        <option value="">Select County</option>
        {[ "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", "Kajiado",
           "Eldoret", "Kakamega", "Meru", "Bungoma", "Nyeri", "Murang'a", "Nanyuki",
           "Kisii", "Kericho", "Bomet", "Embu", "Kitui", "Ol Kalou", "Siaya", "Homa Bay",
           "Migori", "Kapsabet", "Kitale", "Lodwar", "Garissa", "Wajir", "Mandera", "Isiolo",
           "Marsabit", "Tana River", "Lamu", "Kilifi", "Taita Taveta", "Kwale", 
           "Nyamira", "Thika", "Nyandarua", "Laikipia", "Narok", "Naivasha"
        ].map((county) => (
          <option key={county} value={county}>{county}</option>
        ))}
      </select>

      <input name="email" onChange={handleChange} type="email" placeholder="Email Address" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" />
      <input name="password" type="password" placeholder="Password" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" value={formData.password} onChange={handleChange} />

      <div className="text-xs sm:text-sm mt-1 bg-cyan-50 p-2 rounded-md space-y-1">
        <p className={`${formData.password.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>At least 6 characters</p>
        <p className={`${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>At least one uppercase letter</p>
        <p className={`${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>At least one lowercase letter</p>
        <p className={`${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>At least one number</p>
        <p className={`${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>At least one special character</p>
      </div>

      <input name="confirmPassword" type="password" placeholder="Confirm Password" className="p-3 border border-cyan-200 rounded-md bg-white text-gray-600 font-medium placeholder-gray-500" value={formData.confirmPassword} onChange={handleChange} />

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">Upload Avatar</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} className="p-2 border border-cyan-200 rounded-md text-gray-600 font-medium text-sm sm:text-base" />
        {avatarPreview && (
          <img src={avatarPreview} alt="Avatar Preview" className="mt-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto shadow-md" />
        )}
      </div>

      <button type="submit" className="p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md text-base font-semibold transition">
        Sign Up
      </button>

      <p className="text-center text-sm sm:text-base font-medium text-gray-600 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </form>
  </div>
);

};

export default Signup;
