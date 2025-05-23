
import React, { useState, useEffect } from 'react';
import { MdVerified, MdEdit, MdSave } from 'react-icons/md';
import {
  getHealthProArticles,
  getHealthProScans,
  getClinics
} from '../../lib/api'; // ✅ adjust path as needed

const mockProfile = {
  name: "Dr. Wanjiku Mumbi",
  specialty: "OB-GYN",
  licenseNumber: "MED-KEYA-8765",
  hospital: "Nairobi Women's Hospital",
  yearsExperience: 8,
  isVerified: true,
  certifications: ["ACLS", "Neonatal Resuscitation", "OB-GYN Board Certified"],
  languages: ["English", "Swahili", "Kikuyu"],
  bio: "Specialized in high-risk pregnancies with 8 years of experience in maternal care.",
  contactEmail: "wanjiku.mumbi@nw-hospital.org",
  photo: null,
  availability: {}
};

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);

  const [articles, setArticles] = useState([]);
  const [scans, setScans] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    // ✅ Replace all axios calls with imported API functions
    getHealthProArticles()
      .then(setArticles)
      .catch(error => console.error('Error fetching articles:', error));

    getHealthProScans()
      .then(setScans)
      .catch(error => console.error('Error fetching scans:', error));

    getClinics()
      .then(data => {
        const recommended = data.filter(clinic => clinic.recommended);
        setClinics(recommended);
      })
      .catch(error => console.error('Error fetching clinics:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Professional Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1 px-4 py-2 rounded ${isEditing ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
        >
          {isEditing ? <><MdSave /> Save</> : <><MdEdit /> Edit</>}
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl text-gray-500">👩⚕️</span>
          )}
        </div>
        {isEditing && (
          <button className="ml-4 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            Upload Photo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileField label="Name" value={profile.name} editing={isEditing} name="name" onChange={handleInputChange} />
        <ProfileField label="Specialty" value={profile.specialty} editing={isEditing} name="specialty" onChange={handleInputChange} />
        <ProfileField label="License" value={profile.licenseNumber} editing={isEditing} name="licenseNumber" onChange={handleInputChange} />
        <ProfileField label="Hospital" value={profile.hospital} editing={isEditing} name="hospital" onChange={handleInputChange} />
        <ProfileField label="Experience" value={`${profile.yearsExperience} years`} editing={isEditing} name="yearsExperience" type="number" onChange={handleInputChange} />
        <div className="md:col-span-2">
          <ProfileField label="Bio" value={profile.bio} editing={isEditing} name="bio" textarea onChange={handleInputChange} />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <div className="flex items-center gap-2">
          <MdVerified className="text-blue-600" />
          <span className="font-medium">Status:</span>
          {profile.isVerified ? (
            <span className="text-green-600">Verified Professional</span>
          ) : (
            <span className="text-yellow-600">Verification Pending</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Articles</h3>
        {articles.length > 0 ? (
          <ul className="list-disc list-inside">{articles.map((a, i) => <li key={i}>{a.title}</li>)}</ul>
        ) : (
          <p className="text-gray-600">No articles available.</p>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Scans</h3>
        {scans.length > 0 ? (
          <ul className="list-disc list-inside">{scans.map((s, i) => <li key={i}>{s.description}</li>)}</ul>
        ) : (
          <p className="text-gray-600">No scans available.</p>
        )}

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Recommended Clinics</h3>
        {clinics.length > 0 ? (
          <ul className="list-disc list-inside">{clinics.map((c, i) => <li key={i}>{c.name}</li>)}</ul>
        ) : (
          <p className="text-gray-600">No recommended clinics available.</p>
        )}
      </div>
    </div>
  );
}

const ProfileField = ({ label, value, editing, name, type = 'text', textarea = false, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {editing ? (
      textarea ? (
        <textarea name={name} value={value} onChange={onChange} className="w-full border rounded p-2" rows="3" />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} className="w-full border rounded p-2" />
      )
    ) : (
      <p className="p-2 bg-gray-50 rounded">{value || 'Not specified'}</p>
    )}
  </div>
);
